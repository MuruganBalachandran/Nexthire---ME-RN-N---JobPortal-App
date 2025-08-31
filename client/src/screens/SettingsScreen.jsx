import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Linking,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsSection from '../components/settings/SettingsSection';
import AppVersionInfo from '../components/settings/AppVersionInfo';

const SettingsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('Account deleted'), style: 'destructive' },
      ]
    );
  };

  const handleRateApp = () => {
    // This would typically link to the app store
    Linking.openURL('https://play.google.com/store/apps/details?id=com.jobportal');
  };

  const settingsSections = [
    {
      title: 'Account Settings',
      icon: 'person',
      items: [
        {
          icon: 'person-outline',
          title: 'Personal Information',
          subtitle: 'Update your profile details',
          color: '#4CAF50',
          onPress: () => navigation.navigate('PersonalInfo'),
        },
        {
          icon: 'lock-outline',
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          color: '#FF5722',
          onPress: () => navigation.navigate('PrivacySecurity'),
        },
        {
          icon: 'fingerprint',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID',
          color: '#9C27B0',
          type: 'switch',
          value: biometricAuth,
          onValueChange: setBiometricAuth,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      items: [
        {
          icon: 'notifications-active',
          title: 'Push Notifications',
          subtitle: 'Job alerts and app updates',
          color: '#FF9800',
          type: 'switch',
          value: pushNotifications,
          onValueChange: setPushNotifications,
        },
        {
          icon: 'email',
          title: 'Email Notifications',
          subtitle: 'Receive updates via email',
          color: '#2196F3',
          type: 'switch',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
      ],
    },
    {
      title: 'App Settings',
      icon: 'settings',
      items: [
        {
          icon: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          color: '#424242',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          color: '#4CAF50',
          onPress: () => navigation.navigate('Language'),
        },
      ],
    },
    {
      title: 'Support & Feedback',
      icon: 'help',
      items: [
        {
          icon: 'help-center',
          title: 'Help Center',
          subtitle: 'Find answers to common questions',
          color: '#FF9800',
          onPress: () => navigation.navigate('HelpCenter'),
        },
        {
          icon: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          color: '#4CAF50',
          onPress: () => navigation.navigate('Feedback'),
        },
        {
          icon: 'star-rate',
          title: 'Rate the App',
          subtitle: 'Share your experience',
          color: '#FFD700',
          onPress: handleRateApp,
        },
      ],
    },
    {
      title: 'Legal',
      icon: 'gavel',
      items: [
        {
          icon: 'description',
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          color: '#607D8B',
          onPress: () => navigation.navigate('TermsOfService'),
        },
        {
          icon: 'privacy-tip',
          title: 'Privacy Policy',
          subtitle: 'Learn about data protection',
          color: '#795548',
          onPress: () => navigation.navigate('PrivacyPolicy'),
        },
      ],
    },
    {
      title: 'Account Actions',
      icon: 'manage-accounts',
      items: [
        {
          icon: 'delete-forever',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          color: '#F44336',
          onPress: handleDeleteAccount,
          destructive: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <SettingsHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <SettingsSection
            key={index}
            title={section.title}
            icon={section.icon}
            items={section.items}
          />
        ))}
        <AppVersionInfo />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default SettingsScreen;