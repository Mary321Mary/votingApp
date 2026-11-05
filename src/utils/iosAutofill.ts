import { NativeModules, Platform } from "react-native";

export interface MyCardData {
  first_name: string;
  last_name: string;
  email: string;
  zip: string;
  formattedAddress: string;
  address: string;
  aptunit: string;
  city: string;
  phone: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  date_of_birth: string;
}

const { MyCardModule } = NativeModules;

export const getIOSMyCard = async (): Promise<MyCardData> => {
  if (Platform.OS !== "ios") {
    throw new Error("Autofill is available only on iOS");
  }

  if (!MyCardModule) {
    throw new Error("MyCardModule is not linked");
  }

  return await MyCardModule.getMyCard();
};
