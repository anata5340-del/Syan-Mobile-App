import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthNavigator from "./AuthNavigator";
import { useAuthStore } from "../stores/auth.store";
import StackNavigator from "./StackNavigator";
import DrawerNavigation from "./DrawerNavigation";
import * as Keychain from "react-native-keychain";
import Loader from "../Components/Loader";


const Route = () => {

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logOut = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(true);


  
  useEffect(() => {

    const checkAuth = async () => {
      const creds = await Keychain.getGenericPassword();
      if(isLoggedIn && !creds){
        logOut();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);


  if (loading) {
    return <Loader visible={loading}  backgroundColor="rgba(0,0,0,0.4)" />;
  }
    return(
        <SafeAreaProvider>
        <NavigationContainer>
          {isLoggedIn ? <DrawerNavigation />  : <AuthNavigator />  }
          
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default Route;