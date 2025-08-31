/**
 * Job Portal React Native App
 * Main application entry point with navigation and context providers
 */


import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from "./src/navigation/AppNavigator"
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1  }}>
      <Provider store={store}>
        <AuthProvider>
          <AppProvider>
            <SafeAreaProvider>
              <StatusBar 
                barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
                backgroundColor={isDarkMode ? '#000000' : '#000000'}
              />
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </AppProvider>
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
