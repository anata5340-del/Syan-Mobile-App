import React from "react";
import { createStackNavigator , CardStyleInterpolators } from "@react-navigation/stack";
import { RootStackParamList } from './RootStackParamList';
import Onboarding from '../Screens/Onboarding';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import ForgotPassword from '../Screens/ForgotPassword';
import OTP from '../Screens/OTP';
import ResetPassword from '../Screens/ResetPassword';

const AuthStack = createStackNavigator<RootStackParamList>();


const AuthNavigator = () => {
    return(
        <AuthStack.Navigator
            initialRouteName='Onboarding'
            screenOptions={{
                headerShown:false,
                cardStyle: { backgroundColor: "transparent" },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <AuthStack.Screen name="Onboarding" component={Onboarding} />
            <AuthStack.Screen name='SignIn' component={SignIn} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <AuthStack.Screen name="OTP" component={OTP} />
            <AuthStack.Screen name='ResetPassword' component={ResetPassword} />
        </AuthStack.Navigator>
    )
}


export default AuthNavigator;