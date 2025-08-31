import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PostJobScreen from '../screens/recruiter/PostJobScreen';
import EditJobScreen from '../screens/recruiter/EditJobScreen';
import JobApplicationsScreen from '../screens/recruiter/JobApplicationsScreen';
import ApplicantDetailScreen from '../screens/recruiter/ApplicantDetailScreen';
import { COLORS } from '../styles/colors';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SavedJobsScreen from '../screens/jobseeker/SavedJobsScreen';
import SettingsNavigator from './SettingsNavigator';
import ProfileScreen from "../screens/ProfileScreen";

import RecruiterJobsScreen from '../screens/recruiter/RecruiterJobsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ApplicationsStackNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="JobApplicationsList" 
        component={JobApplicationsScreen}
        options={{ title: 'Job Applications' }}
      />
      <Stack.Screen 
        name="ApplicantDetail" 
        component={ApplicantDetailScreen}
        options={{ title: 'Applicant Details' }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'PostJob') {
            iconName = 'add-circle';
          } else if (route.name === 'Applications') {
            iconName = 'people';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="PostJob" 
        component={PostJobScreen}
        options={{ title: 'Post Job' }}
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsStackNavigator}
        options={{ title: 'Applications' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RecruiterNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="RecruiterJobs" component={RecruiterJobsScreen} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
  <Stack.Screen name="EditJob" component={EditJobScreen} />
  <Stack.Screen name="Settings" component={SettingsNavigator} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
    </Stack.Navigator>
  );
};

export default RecruiterNavigator;

