import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ResumePicker from '../../components/ResumePicker';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const ProfileSetupScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    phone: '',
    location: '',
    bio: '',
    skills: '', // For job seekers
    company: '', // For recruiters
    experience: '', // For job seekers
    resume: null,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    const { phone, location, bio } = profileData;

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    if (isJobSeeker && !profileData.resume) {
      Alert.alert('Error', 'Please upload your resume (PDF, DOC, DOCX)');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(profileData);
      Alert.alert('Success', 'Profile completed successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const isJobSeeker = user?.userType === 'jobseeker';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            {isJobSeeker 
              ? 'Help employers find you' 
              : 'Set up your recruiter profile'
            }
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            placeholder="Phone Number"
            value={profileData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            icon="phone"
          />

          <InputField
            placeholder="Location (City, State)"
            value={profileData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            icon="location-on"
          />

          <InputField
            placeholder={isJobSeeker ? "Tell us about yourself" : "Company description"}
            value={profileData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            multiline
            numberOfLines={4}
            icon="description"
          />

          {isJobSeeker ? (
            <>
              <InputField
                placeholder="Skills (e.g., React Native, JavaScript)"
                value={profileData.skills}
                onChangeText={(value) => handleInputChange('skills', value)}
                icon="build"
              />

              <InputField
                placeholder="Years of Experience"
                value={profileData.experience}
                onChangeText={(value) => handleInputChange('experience', value)}
                keyboardType="numeric"
                icon="work"
              />

              <ResumePicker
                value={profileData.resume}
                onChange={(file) => handleInputChange('resume', file)}
              />
            </>
          ) : (
            <InputField
              placeholder="Company Name"
              value={profileData.company}
              onChangeText={(value) => handleInputChange('company', value)}
              icon="business"
            />
          )}

          <Button
            title="Complete Profile"
            onPress={handleComplete}
            loading={loading}
            style={styles.completeButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  completeButton: {
    marginTop: 30,
  },
});

export default ProfileSetupScreen;

