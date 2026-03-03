import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, AppState, AppStateStatus } from 'react-native';
import Route from './src/Navigation/Route';
import { WithSplashScreen } from './src/Components/Splash';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './src/Constants/theme';
import ReactQueryProvider from './src/react-query-provider';
import { useAuthStore } from './src/stores/auth.store';
import { getToken } from './src/utils/token';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const checkAndRefreshToken = useAuthStore((s) => s.checkAndRefreshToken);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    SplashScreen.hide();
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Validate token on app start
  useEffect(() => {
    const validateAuth = async () => {
      const token = await getToken();
      
      // If isLoggedIn is true but no token exists, logout
      if (isLoggedIn && !token) {
        console.log(' No token found but marked as logged in, logging out');
        await useAuthStore.getState().logout();
        return;
      }

      // If we have a token, check if it's valid/refresh it
      if (token) {
        console.log(' Checking token on app start');
        await checkAndRefreshToken();
      }
    };

    validateAuth();
  }, []); // Run once on mount

  // Check token when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isLoggedIn
      ) {
        console.log(' App returned to foreground, checking token');
        await checkAndRefreshToken();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn, checkAndRefreshToken]);

  return (
    <ReactQueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WithSplashScreen isAppReady={isAppReady}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
              <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                  <Route />
                </SafeAreaView>
              </SafeAreaProvider>
            </Provider>
          </GestureHandlerRootView>
        </WithSplashScreen>
      </GestureHandlerRootView>
    </ReactQueryProvider>
  );
};

export default App;