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

        DispatchQueue.main.async {

            if self.resolve != nil {
                reject(
                    "PICKER_IN_PROGRESS",
                    "Contact picker is already open",
                    nil
                )
                return
            }

            guard let viewController = Self.topViewController() else {
                reject(
                    "PRESENTATION_ERROR",
                    "Unable to open contact picker",
                    nil
                )
                return
            }

            self.resolve = resolve
            self.reject = reject

            let picker = CNContactPickerViewController()
            picker.delegate = self

            viewController.present(picker, animated: true)
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
