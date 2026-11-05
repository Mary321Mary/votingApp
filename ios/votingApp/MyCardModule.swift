import Foundation
import Contacts
import React

@objc(MyCardModule)
class MyCardModule: NSObject {

  @objc
  func getMyCard(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let store = CNContactStore()

    let fetchContact: () -> Void = {
      DispatchQueue.global(qos: .userInitiated).async {
        do {
          let keys: [CNKeyDescriptor] = [
            CNContactGivenNameKey as CNKeyDescriptor,
            CNContactFamilyNameKey as CNKeyDescriptor,
            CNContactEmailAddressesKey as CNKeyDescriptor,
            CNContactPhoneNumbersKey as CNKeyDescriptor,
            CNContactPostalAddressesKey as CNKeyDescriptor,
            CNContactBirthdayKey as CNKeyDescriptor
          ]

          guard let contact = try store.unifiedMeContactWithKeys(
            toFetch: keys
          ) else {
            reject(
              "NO_MY_CARD",
              "My Card was not found on this iPhone",
              nil
            )
            return
          }

          let email = contact.emailAddresses.first?.value as String? ?? ""
          let phone = contact.phoneNumbers.first?.value.stringValue ?? ""

          let postalAddress = contact.postalAddresses.first?.value

          let street = postalAddress?.street ?? ""
          let city = postalAddress?.city ?? ""
          let zip = postalAddress?.postalCode ?? ""

          let birthday = contact.birthday

          let month = birthday?.month ?? 0
          let day = birthday?.day ?? 0
          let year = birthday?.year ?? 0

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

          let formattedAddress = CNPostalAddressFormatter.string(
            from: postalAddress ?? CNMutablePostalAddress(),
            style: .mailingAddress
          )

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
            "birthMonth": month > 0 ? String(month) : "",
            "birthDay": day > 0 ? String(day) : "",
            "birthYear": year > 0 ? String(year) : "",
            "date_of_birth": dateOfBirth
          ]

          DispatchQueue.main.async {
            resolve(result)
          }

        } catch {
          reject("CONTACT_ERROR", error.localizedDescription, error)
        }
      }
    }

    let status = CNContactStore.authorizationStatus(for: .contacts)

    switch status {
    case .authorized, .limited:
      fetchContact()

    case .notDetermined:
      store.requestAccess(for: .contacts) { granted, error in
        if granted {
          fetchContact()
        } else {
          reject(
            "PERMISSION_DENIED",
            "Access to contacts was denied",
            error
          )
        }
      }

    case .denied, .restricted:
      reject(
        "PERMISSION_DENIED",
        "Please allow access to Contacts in iPhone Settings",
        nil
      )

    @unknown default:
      reject("UNKNOWN_ERROR", "Unknown contacts permission status", nil)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}