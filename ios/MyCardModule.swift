import Foundation
import Contacts
import ContactsUI
import UIKit
import React

@objc(MyCardModule)
class MyCardModule: NSObject, CNContactPickerDelegate {

    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?

    // MARK: - Open Contact Picker

    @objc(getMyCard:rejecter:)
    func getMyCard(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let store = CNContactStore()
        store.requestAccess(for: .contacts) { granted, error in

            guard granted else {
                reject(
                    "PERMISSION_DENIED",
                    "Contacts access was denied",
                    error
                )
                return
            }

            DispatchQueue.global(qos: .userInitiated).async {
                let keys: [CNKeyDescriptor] = [
                    CNContactGivenNameKey as CNKeyDescriptor,
                    CNContactFamilyNameKey as CNKeyDescriptor,
                    CNContactEmailAddressesKey as CNKeyDescriptor,
                    CNContactPhoneNumbersKey as CNKeyDescriptor,
                    CNContactPostalAddressesKey as CNKeyDescriptor,
                    CNContactBirthdayKey as CNKeyDescriptor
                ]

                do {
                    let contact = try store.unifiedMeContactWithKeys(
                        toFetch: keys
                    )

                    let email = contact.emailAddresses.first.map {
                        String($0.value)
                    } ?? ""

                    let phone = contact.phoneNumbers.first?
                        .value.stringValue ?? ""

                    let postalAddress = contact.postalAddresses.first?.value

                    let month = contact.birthday?.month ?? 0
                    let day = contact.birthday?.day ?? 0
                    let year = contact.birthday?.year ?? 0

                    let dateOfBirth: String

                    if month > 0 && day > 0 {
                        if year > 0 {
                            dateOfBirth = String(
                                format: "%04d-%02d-%02d",
                                year, month, day
                            )
                        } else {
                            dateOfBirth = String(
                                format: "%02d-%02d",
                                month, day
                            )
                        }
                    } else {
                        dateOfBirth = ""
                    }

                    let formattedAddress: String

                    if let postalAddress = postalAddress {
                        formattedAddress = CNPostalAddressFormatter.string(
                            from: postalAddress,
                            style: .mailingAddress
                        )
                    } else {
                        formattedAddress = ""
                    }

                    let result: [String: Any] = [
                        "first_name": contact.givenName,
                        "last_name": contact.familyName,
                        "email": email,
                        "zip": postalAddress?.postalCode ?? "",
                        "formattedAddress": formattedAddress,
                        "address": postalAddress?.street ?? "",
                        "aptunit": "",
                        "city": postalAddress?.city ?? "",
                        "phone": phone,
                        "birthMonth": month > 0 ? String(month) : "",
                        "birthDay": day > 0 ? String(day) : "",
                        "birthYear": year > 0 ? String(year) : "",
                        "date_of_birth": dateOfBirth
                    ]

                    resolve(result)

                } catch {
                    reject(
                        "MY_CARD_NOT_FOUND",
                        "Unable to retrieve My Card contact",
                        error
                    )
                }
            }
        }
    }

    // MARK: - Contact Selected

    func contactPicker(
        _ picker: CNContactPickerViewController,
        didSelect contact: CNContact
    ) {

        let email = contact.emailAddresses.first.map {
            String($0.value)
        } ?? ""

        let phone = contact.phoneNumbers.first?.value.stringValue ?? ""

        let postalAddress = contact.postalAddresses.first?.value

        let street = postalAddress?.street ?? ""
        let city = postalAddress?.city ?? ""
        let zip = postalAddress?.postalCode ?? ""

        let formattedAddress: String

        if let postalAddress = postalAddress {
            formattedAddress = CNPostalAddressFormatter.string(
                from: postalAddress,
                style: .mailingAddress
            )
        } else {
            formattedAddress = ""
        }

        // Birthday
        let birthday = contact.birthday

        let month = birthday?.month ?? 0
        let day = birthday?.day ?? 0
        let year = birthday?.year ?? 0

        let birthMonth = month > 0
            ? String(format: "%02d", month)
            : ""

        let birthDay = day > 0
            ? String(format: "%02d", day)
            : ""

        let birthYear = year > 0
            ? String(format: "%04d", year)
            : ""

        let dateOfBirth: String

        if month > 0 && day > 0 {
            if year > 0 {
                dateOfBirth = "\(birthYear)-\(birthMonth)-\(birthDay)"
            } else {
                dateOfBirth = "\(birthMonth)-\(birthDay)"
            }
        } else {
            dateOfBirth = ""
        }

        // Data returned to React Native
        let result: [String: Any] = [
            "first_name": contact.givenName,
            "last_name": contact.familyName,
            "email": email,
            "zip": zip,
            "formattedAddress": formattedAddress,
            "address": street,
            "aptunit": "",
            "city": city,
            "phone": phone,
            "birthMonth": birthMonth,
            "birthDay": birthDay,
            "birthYear": birthYear,
            "date_of_birth": dateOfBirth
        ]

        resolve?(result)

        self.resolve = nil
        self.reject = nil
    }

    // MARK: - Picker Cancelled

    func contactPickerDidCancel(
        _ picker: CNContactPickerViewController
    ) {
        reject?(
            "CANCELLED",
            "Contact selection was cancelled",
            nil
        )

        resolve = nil
        reject = nil
    }

    // MARK: - Find Current View Controller

    private static func topViewController() -> UIViewController? {

        let scenes = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }

        let keyWindow = scenes
            .flatMap { $0.windows }
            .first { $0.isKeyWindow }

        var topController = keyWindow?.rootViewController

        while let presented = topController?.presentedViewController {
            topController = presented
        }

        return topController
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
