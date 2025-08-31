
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import JobSeekerNavigator from './JobSeekerNavigator';
import RecruiterNavigator from './RecruiterNavigator';
import { COLORS } from '../styles/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.userType === 'jobseeker' ? (
        <Stack.Screen name="JobSeeker" component={JobSeekerNavigator} />
      ) : (
        <Stack.Screen name="Recruiter" component={RecruiterNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

