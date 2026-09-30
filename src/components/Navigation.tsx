import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import SuccessScreen from "@/screens/success/Success";
import LookupScreen from "@/screens/onboarding/Lookup";
import ZipErrorScreen from "@/screens/ZipError";
import { CheckVoterStatusScreen } from "@/screens/onboarding/CheckVoterStatus";
import PrintScreen from "@/screens/Print";
import { NotParticipatingScreen } from "@/screens/NotParticipating";
import { SuccessMIScreen } from "@/screens/success/SuccessMI";
import FailMIScreen from "@/screens/fail/FailMI";
import { SuccessPAScreen } from "@/screens/success/SuccessPA";
import FailPAScreen from "@/screens/fail/FailPA";
import { SuccessWAScreen } from "@/screens/success/SuccessWA";
import FailWAScreen from "@/screens/fail/FailWA";
import LookupNotFoundScreen from "@/screens/onboarding/LookupNotFound";
import AlreadyRegisteredScreen from "@/screens/AlreadyRegistered";
import ApiErrorScreen from "@/screens/ApiError";
import { Under18Screen } from "@/screens/Under18Screen";
import PreRegisterScreen from "@/screens/PreRegister";
import FinishWithStateScreen from "@/screens/FinishWithState";
import FailCAScreen from "@/screens/fail/FailCA";
import AfterDeadlineScreen from "@/screens/AfterDeadline";
import Under18ReminderScreen from "@/screens/Under18Reminder";
import { CovrCheckMethodName } from "../utils/report/covrFailReporting";
import WelcomeScreen from "../screens/onboarding/Welcome";
import { FIRST_TIME_COMPLETED_KEY } from "../utils/constants";
import WelcomeBackScreen from "../screens/onboarding/WelcomeBack";
import Onboarding2Screen from "../screens/onboarding/Onboarding2";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/Settings";

export type RootStackParamList = {
  Home: undefined; // or { id: string }
  Welcome: {
    header: string;
    text: string;
  }; // or { id: string }
  WelcomeBack: undefined;
  Onboarding2: {
    form: CheckRegistrationStatus;
  };
  Settings: undefined;
  Profile: undefined;
  Notifications: undefined;
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
    workflow_type: string;
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
  SuccessMI: { state: StateData; form: RegisterFormState };
  FailMI: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
    apiTimeoutMethod?: CovrCheckMethodName;
  };
  SuccessPA: { state: StateData; form: RegisterFormState };
  FailPA: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
    apiTimeoutMethod?: CovrCheckMethodName;
  };
  SuccessWA: { state: StateData; form: RegisterFormState };
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
    apiTimeoutMethod?: CovrCheckMethodName;
  };
  Under18: {
    state: StateData;
    form: RegisterFormState;
    workflow_type: string;
    registration_uid: string;
  };
  Under18Reminder: {
    state: StateData;
    form: RegisterFormState;
  };
  PreRegister: {
    state: StateData;
    form: RegisterFormState;
    workflow_type: string;
    formCongif: DataCollectionConfiguration;
    registration_uid: string;
  };
  AfterDeadline: {
    response: SubmitEmailZipResponse;
    zip: string;
    email: string;
  };
  FinishWithState: {
    state: StateData;
    form: RegisterFormState;
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
  const [initialRouteName, setInitialRouteName] = useState<
    "Welcome" | "WelcomeBack" | null
  >(null);

  useEffect(() => {
    const loadInitialRoute = async () => {
      const firstTimeCompleted = await AsyncStorage.getItem(
        FIRST_TIME_COMPLETED_KEY,
      );
      setInitialRouteName(
        firstTimeCompleted === "true" ? "WelcomeBack" : "Welcome",
      );
    };

    loadInitialRoute().catch(() => setInitialRouteName("Welcome"));
  }, []);

  if (!initialRouteName) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
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
        name="WelcomeBack"
        component={withDefaultLayout(WelcomeBackScreen)}
      />
      <Stack.Screen
        name="Onboarding2"
        component={withDefaultLayout(Onboarding2Screen)}
      />
      <Stack.Screen
        name="Settings"
        component={withDefaultLayout(SettingsScreen)}
      />
      <Stack.Screen
        name="Profile"
        component={withDefaultLayout(ProfileScreen)}
      />
      <Stack.Screen
        name="Notifications"
        component={withDefaultLayout(NotificationsScreen)}
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
        name="Under18Reminder"
        component={withDefaultLayout(Under18ReminderScreen)}
      />
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
