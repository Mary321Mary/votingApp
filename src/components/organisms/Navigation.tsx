import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DefaultLayout from "@/layout/DefaultLayout";
import { SubmitEmailZipResponseProps } from "@/utils/types";
import HomeScreen from "@/screens/Home";
import RegisterScreen from "@/screens/Register";
import SuccessScreen from "@/screens/Success";

export type RootStackParamList = {
  Home: undefined; // or { id: string }
  Register: SubmitEmailZipResponseProps; // or { id: string }
  Success: undefined; // or { id: string }
};

const withDefaultLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <DefaultLayout>
      <Component {...props} />
    </DefaultLayout>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation({ }) {
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
    </Stack.Navigator>
  );
}

export default Navigation;
