import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultLayout from "@/layout/DefaultLayout";
import {
  CheckRegistrationStatus,
  DataCollectionConfiguration,
  RegisterFormState,
  StateData,
  SubmitEmailZipResponse,
  SubmitEmailZipResponseProps,
  UserData,
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
import { SuccessPAScreen } from "@/screens/SuccessPA";
import FailPAScreen from "@/screens/FailPA";
import { SuccessWAScreen } from "@/screens/SuccessWA";
import FailWAScreen from "@/screens/FailWA";
import LookupNotFoundScreen from "@/screens/LookupNotFound";
import AlreadyRegisteredScreen from "@/screens/AlreadyRegistered";
import ApiErrorScreen from "@/screens/ApiError";
import { Under18Screen } from "@/screens/Under18Screen";
import PreRegisterScreen from "@/screens/PreRegister";
import FinishWithStateScreen from "@/screens/FinishWithState";
import FailCAScreen from "@/screens/FailCA";
import AfterDeadlineScreen from "@/screens/AfterDeadline";

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
    form: CheckRegistrationStatus;
  };
  Lookup: {
    state?: StateData;
    form?: CheckRegistrationStatus;
  };
  LookupNotFound: {
    state: StateData;
    form: CheckRegistrationStatus;
  };
  AlreadyRegistered: {
    state: StateData;
    form: RegisterFormState;
  };
  ZipError: {
    text: string;
    header?: string;
    showImage?: boolean;
    user: UserData | null;
  };
  NotParticipating: { state: StateData };
  Print: {
    form: RegisterFormState;
    state: StateData;
    workflow_type?: string;
    finish_with_state: boolean;
  };
  SuccessMI: { state: StateData };
  FailMI: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
  };
  SuccessPA: { state: StateData };
  FailPA: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
  };
  SuccessWA: { state: StateData };
  FailCA: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
  };
  FailWA: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
  };
  Under18: {
    state: StateData;
  };
  PreRegister: {
    state: StateData;
    form: RegisterFormState;
    workflow_type: string;
    formCongif: DataCollectionConfiguration;
  };
  AfterDeadline: {
    response: SubmitEmailZipResponse;
    zip: string;
    email: string;
  };
  FinishWithState: {
    state: StateData;
  };
  ApiError: { state: StateData; title?: string };
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
        name="AlreadyRegistered"
        component={withDefaultLayout(AlreadyRegisteredScreen)}
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
      <Stack.Screen
        name="SuccessPA"
        component={withDefaultLayout(SuccessPAScreen)}
      />
      <Stack.Screen name="FailPA" component={withDefaultLayout(FailPAScreen)} />
      <Stack.Screen
        name="SuccessWA"
        component={withDefaultLayout(SuccessWAScreen)}
      />
      <Stack.Screen name="FailWA" component={withDefaultLayout(FailWAScreen)} />
      <Stack.Screen name="FailCA" component={withDefaultLayout(FailCAScreen)} />
      <Stack.Screen
        name="Under18"
        component={withDefaultLayout(Under18Screen)}
      />
      <Stack.Screen
        name="PreRegister"
        component={withDefaultLayout(PreRegisterScreen)}
      />
      <Stack.Screen
        name="AfterDeadline"
        component={withDefaultLayout(AfterDeadlineScreen)}
      />
      <Stack.Screen
        name="FinishWithState"
        component={withDefaultLayout(FinishWithStateScreen)}
      />
      <Stack.Screen
        name="ApiError"
        component={withDefaultLayout(ApiErrorScreen)}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
