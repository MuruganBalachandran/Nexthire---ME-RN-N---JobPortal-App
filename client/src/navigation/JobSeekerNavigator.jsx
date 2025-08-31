import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobListScreen from '../screens/jobseeker/JobListScreen';
import JobDetailScreen from '../screens/jobseeker/JobDetailScreen';
import ApplicationStatusScreen from '../screens/jobseeker/ApplicationStatusScreen';
import ApplyJobScreen from '../screens/jobseeker/ApplyJobScreen';
import { COLORS } from '../styles/colors';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsNavigator from './SettingsNavigator';
import SavedJobsScreen from '../screens/jobseeker/SavedJobsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const JobStackNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="JobList" 
        component={JobListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ApplyJob" 
        component={ApplyJobScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ApplicationsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} options={{ headerShown: false }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Jobs') {
            iconName = 'work';
          } else if (route.name === 'Applications') {
            iconName = 'assignment';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobStackNavigator} />
      <Tab.Screen name="Applications" component={ApplicationsStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const JobSeekerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Settings" component={SettingsNavigator} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
    </Stack.Navigator>
  );
};

export default JobSeekerNavigator;

