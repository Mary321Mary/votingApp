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
import ZipErrorScreen from "@/screens/ZipError";
import { NotParticipatingScreen } from "@/screens/NotParticipating";

import LookupScreen from "@/screens/onboarding/Lookup";
import { CheckVoterStatusScreen } from "@/screens/onboarding/CheckVoterStatus";
import LookupNotFoundScreen from "@/screens/onboarding/LookupNotFound";
import WelcomeScreen from "@/screens/onboarding/Welcome";
import DashboardScreen from "@/screens/onboarding/Dashboard";
import Onboarding2Screen from "@/screens/onboarding/Onboarding2";

import PrintScreen from "@/screens/success/Print";
import SuccessScreen from "@/screens/success/Success";
import { SuccessMIScreen } from "@/screens/success/SuccessMI";
import { SuccessPAScreen } from "@/screens/success/SuccessPA";
import { SuccessWAScreen } from "@/screens/success/SuccessWA";
import FinishWithStateScreen from "@/screens/success/FinishWithState";
import FailWAScreen from "@/screens/fail/FailWA";
import FailCAScreen from "@/screens/fail/FailCA";
import FailMIScreen from "@/screens/fail/FailMI";
import FailPAScreen from "@/screens/fail/FailPA";

import AlreadyRegisteredScreen from "@/screens/AlreadyRegistered";
import ApiErrorScreen from "@/screens/ApiError";
import { Under18Screen } from "@/screens/Under18Screen";
import PreRegisterScreen from "@/screens/PreRegister";
import AfterDeadlineScreen from "@/screens/AfterDeadline";
import Under18ReminderScreen from "@/screens/Under18Reminder";
import NotificationsScreen from "@/screens/NotificationsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import SettingsScreen from "@/screens/Settings";

import {
  FIRST_TIME_COMPLETED_KEY,
  ONBOARDING_COMPLETED_KEY,
} from "@/utils/constants";
import { CovrCheckMethodName } from "@/utils/report/covrFailReporting";
import ReturnScreen from "../screens/onboarding/Return";
import BallotScreen from "../screens/Ballot";
import LocationScreen from "../screens/Location";

export type RootStackParamList = {
  Home: undefined; // or { id: string }
  Welcome: undefined; // or { id: string }
  Dashboard: undefined;
  Return: undefined;
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
    onboardingFlow?: boolean;
  }; // or { id: string }
  CheckVoterStatus: {
    form: CheckRegistrationStatus;
    afterNotFound?: boolean;
  };
  Lookup: {
    state: StateData;
    form: CheckRegistrationStatus;
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
    onboardingFlow?: boolean;
  };
  SuccessMI: {
    state: StateData;
    form: RegisterFormState;
    onboardingFlow?: boolean;
  };
  FailMI: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
    apiTimeoutMethod?: CovrCheckMethodName;
  };
  SuccessPA: {
    state: StateData;
    form: RegisterFormState;
    onboardingFlow?: boolean;
  };
  FailPA: {
    state: StateData;
    zip: string;
    email: string;
    form: RegisterFormState;
    apiTimeoutMethod?: CovrCheckMethodName;
  };
  SuccessWA: {
    state: StateData;
    form: RegisterFormState;
    onboardingFlow?: boolean;
  };
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
    onboardingFlow?: boolean;
  };
  ApiError: { state: StateData; title?: string };
  Ballot: undefined;
  Location: undefined;
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
    "Welcome" | "Dashboard" | "Return" | null
  >(null);

  useEffect(() => {
    const loadInitialRoute = async () => {
      const firstTimeCompleted = await AsyncStorage.getItem(
        FIRST_TIME_COMPLETED_KEY,
      );
      const onboardingCompletedKey = await AsyncStorage.getItem(
        ONBOARDING_COMPLETED_KEY,
      );
      setInitialRouteName(
        firstTimeCompleted === "true"
          ? onboardingCompletedKey
            ? "Dashboard"
            : "Return"
          : "Welcome",
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
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
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
        component={CheckVoterStatusScreen}
      />
      <Stack.Screen name="Lookup" component={withDefaultLayout(LookupScreen)} />
      <Stack.Screen
        name="LookupNotFound"
        component={withDefaultLayout(LookupNotFoundScreen)}
      />
      <Stack.Screen
        name="Onboarding2"
        component={withDefaultLayout(Onboarding2Screen)}
      />
      <Stack.Screen
        name="AlreadyRegistered"
        component={withDefaultLayout(AlreadyRegisteredScreen)}
      />
      <Stack.Screen name="Return" component={withDefaultLayout(ReturnScreen)} />
      <Stack.Screen
        name="Dashboard"
        component={withDefaultLayout(DashboardScreen)}
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
      <Stack.Screen name="Ballot" component={withDefaultLayout(BallotScreen)} />
      <Stack.Screen
        name="Location"
        component={withDefaultLayout(LocationScreen)}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
