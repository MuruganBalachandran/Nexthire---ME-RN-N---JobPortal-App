import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../styles/colors';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: COLORS.headerBackground,
        },
        headerTintColor: COLORS.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      {/* Add more settings screens here as needed */}
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
