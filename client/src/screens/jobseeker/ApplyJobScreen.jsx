// screens/ApplyJobScreen.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Alert, Animated, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { submitJobApplication } from '../services/api';
import { COLORS } from '../../styles/colors';

// ✅ Modular Components
import ApplyHeader from "../../components/jobseeker/applyjob/ApplyHeader";
import JobInfoCard from '../../components/jobseeker/applyjob/JobInfoCard';
import CoverLetterSection from '../../components/jobseeker/applyjob/CoverLetterSection';
import SalarySection from '../../components/jobseeker/applyjob/SalarySection';
import ExperienceSection from '../../components/jobseeker/applyjob/ExperienceSection';
import SubmitButton from '../../components/jobseeker/applyjob/SubmitButton';

const ApplyJobScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { user } = useContext(AuthContext);

  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleApply = async () => {
    console.log('[ApplyJobScreen] handleApply triggered.');

    if (coverLetter.trim().length < 50) {
      Alert.alert('Error', 'Please write a cover letter (minimum 50 characters)');
      return;
    }
    if (!expectedSalary || isNaN(expectedSalary) || Number(expectedSalary) <= 0) {
      Alert.alert('Error', 'Please enter a valid expected salary');
      return;
    }
    if (experience.trim().length < 10) {
      Alert.alert('Error', 'Please describe your experience (minimum 10 characters)');
      return;
    }

    setLoading(true);
    try {
      const applicationData = {
        applicantId: user?._id,
        coverLetter,
        expectedSalary: { amount: Number(expectedSalary) },
        experience,
      };
      console.log('[ApplyJobScreen] Submitting application for job:', job._id, 'with data:', applicationData);
      
      await submitJobApplication(job._id, applicationData);

      console.log('[ApplyJobScreen] Application submitted successfully.');
      Alert.alert(
        'Application Submitted!',
        'Your application has been successfully submitted.',
        [
          {
            text: 'Track Application',
            onPress: () => navigation.navigate('ApplicationStatus'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('[ApplyJobScreen] Error submitting application:', error);
      Alert.alert('Error', `Failed to submit application. ${error.message || 'Please try again.'}`);
    } finally {
      console.log('[ApplyJobScreen] handleApply finished.');
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <ApplyHeader  />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Job Info */}
        <JobInfoCard job={job} />

        {/* Form Sections */}
        <CoverLetterSection value={coverLetter} onChangeText={setCoverLetter} />
        <SalarySection value={expectedSalary} onChangeText={setExpectedSalary} />
        <ExperienceSection value={experience} onChangeText={setExperience} />

        {/* Submit */}
        <View style={styles.buttonWrapper}>
          <SubmitButton loading={loading} onPress={handleApply} />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export default ApplyJobScreen;
