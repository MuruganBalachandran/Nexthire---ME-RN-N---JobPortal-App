import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen.jsx';
import SignupScreen from "../screens/auth/SignupScreen.jsx";
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false ,
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="ProfileSetup" 
        component={ProfileSetupScreen}
        options={{ title: 'Complete Profile' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

