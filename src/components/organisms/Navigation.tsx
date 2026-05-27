import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultLayout from "@/layout/DefaultLayout";
import {
  RegisterFormState,
  StateData,
  SubmitEmailZipResponseProps,
} from "@/utils/types";
import HomeScreen from "@/screens/Home";
import RegisterScreen from "@/screens/Register";
import SuccessScreen from "@/screens/Success";
import LookupScreen from "@/screens/Lookup";
import ZipErrorScreen from "@/screens/ZipError";
import { CheckVoterStatusScreen } from "@/screens/CheckVoterStatus";
import PrintScreen from "@/screens/Print";
import { NotParticipatingScreen } from "@/screens/NotParticipating";
import { SuccessMIScreen } from "@/screens/SuccessMI";
import FailMIScreen from "@/screens/FailMI";
import LookupNotFoundScreen from "@/screens/LookupNotFound";

export type RootStackParamList = {
  Home: undefined; // or { id: string }
  Register: SubmitEmailZipResponseProps; // or { id: string }
  Success: {
    form: RegisterFormState;
    state: StateData;
    workflow_type?: string;
    finish_with_state: boolean;
  }; // or { id: string }
  CheckVoterStatus: {
    email: string;
    zip: string;
    form: RegisterFormState;
  };
  Lookup: {
    state: StateData;
    form: RegisterFormState;
  };
  LookupNotFound: {
    state: StateData;
    form: RegisterFormState;
  };
  ZipError: { text: string; header?: string; showImage?: boolean };
  NotParticipating: { state: StateData };
  Print: {
    form: RegisterFormState;
    state: StateData;
    workflow_type?: string;
    finish_with_state: boolean;
    under_construction?: boolean;
  };
  SuccessMI: {
    state: StateData;
  };
  FailMI: {
    state: StateData;
    form: RegisterFormState;
  };
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
        name="LookupNotFound"
        component={withDefaultLayout(LookupNotFoundScreen)}
      />
      <Stack.Screen
        name="ZipError"
        component={withDefaultLayout(ZipErrorScreen)}
      />
      <Stack.Screen name="Print" component={withDefaultLayout(PrintScreen)} />
      <Stack.Screen
        name="NotParticipating"
        component={withDefaultLayout(NotParticipatingScreen)}
      />
      <Stack.Screen
        name="SuccessMI"
        component={withDefaultLayout(SuccessMIScreen)}
      />
      <Stack.Screen name="FailMI" component={withDefaultLayout(FailMIScreen)} />
    </Stack.Navigator>
  );
}

export default Navigation;
