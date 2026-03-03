import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultLayout from "@/layout/DefaultLayout";
import { SubmitEmailZipResponseProps } from "@/utils/types";
import HomeScreen from "@/screens/Home";
import RegisterScreen from "@/screens/Register";
import SuccessScreen from "@/screens/Success";
import LookupScreen from "@/screens/Lookup";
import ZipErrorScreen from "@/screens/ZipError";
import { CheckVoterStatusScreen } from "@/screens/CheckVoterStatus";

export type RootStackParamList = {
  Home: undefined; // or { id: string }
  Register: SubmitEmailZipResponseProps; // or { id: string }
  Success: undefined; // or { id: string }
  CheckVoterStatus: { email: string; zip: string };
  Lookup: undefined;
  ZipError: { text: string; header?: string };
};

const withDefaultLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <DefaultLayout>
      <Component {...props} />
    </DefaultLayout>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation({}) {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={withDefaultLayout(HomeScreen)} />
      <Stack.Screen
        name="Register"
        component={withDefaultLayout(RegisterScreen)}
      />
      <Stack.Screen
        name="Success"
        component={withDefaultLayout(SuccessScreen)}
      />
      <Stack.Screen
        name="CheckVoterStatus"
        component={withDefaultLayout(CheckVoterStatusScreen)}
      />
      <Stack.Screen name="Lookup" component={withDefaultLayout(LookupScreen)} />
      <Stack.Screen
        name="ZipError"
        component={withDefaultLayout(ZipErrorScreen)}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
