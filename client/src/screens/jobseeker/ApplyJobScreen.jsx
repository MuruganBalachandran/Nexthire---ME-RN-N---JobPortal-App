// screens/ApplyJobScreen.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Alert, Animated, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { submitJobApplication } from '../../services/api';
import { COLORS } from '../../styles/colors';
import FONTS from '../../styles/fonts';
// ✅ Modular Components
import ApplyHeader from "../../components/jobseeker/applyjob/ApplyHeader";
import JobInfoCard from '../../components/jobseeker/applyjob/JobInfoCard';
import CoverLetterSection from '../../components/jobseeker/applyjob/CoverLetterSection';
import SalarySection from '../../components/jobseeker/applyjob/SalarySection';
import ProjectLinksSection from '../../components/jobseeker/applyjob/ProjectLinksSection';
import ExperienceSection from '../../components/jobseeker/applyjob/ExperienceSection';

const AI_TEMPLATES = [
  "I am excited to apply for this position. My skills and experience closely match the requirements, and I am eager to contribute to your team.",
  "With a strong background in the industry and a passion for growth, I believe I am a great fit for this role.",
  "I am confident that my experience and dedication will allow me to make a positive impact at your company.",
];
import SubmitButton from '../../components/jobseeker/applyjob/SubmitButton';

const ApplyJobScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { user } = useContext(AuthContext);

  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [projectLinks, setProjectLinks] = useState('');

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
    if (!expectedSalary) {
      Alert.alert('Error', 'Please select your expected salary');
      return;
    }
    if (experience.trim().length < 10) {
      Alert.alert('Error', 'Please describe your experience (minimum 10 characters)');
      return;
    }

    if (projectLinks.trim().length < 5) {
      Alert.alert('Error', 'Please provide at least one relevant project link.');
      return;
    }
    setLoading(true);
    try {
      const applicationData = {
        applicantId: user?._id,
        coverLetter,
        expectedSalary: { amount: Number(expectedSalary) }, // send as object with amount
        experience,
        projectLinks,
      };
      console.log('[ApplyJobScreen] Submitting application for job:', job._id, 'with data:', applicationData);
      const response = await submitJobApplication(job._id, applicationData);
      console.log('[ApplyJobScreen] Application API response:', response);

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
      <ApplyHeader />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <CoverLetterSection
          value={coverLetter}
          onChangeText={setCoverLetter}
          job={job}
        />
        {showTemplates && (
          <View style={styles.templatesBox}>
            <Text style={styles.templatesTitle}>AI Suggestions</Text>
            {AI_TEMPLATES.map((template, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.templateItem}
                onPress={() => {
                  setCoverLetter(template);
                  setShowTemplates(false);
                }}
              >
                <Text style={styles.templateText}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
  <SalarySection expectedSalary={expectedSalary} setExpectedSalary={setExpectedSalary} job={job} />
  <ExperienceSection value={experience} onChangeText={setExperience} />
  <ProjectLinksSection value={projectLinks} onChangeText={setProjectLinks} />
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
  templatesBox: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  templatesTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  templateItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  templateText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
});

export default ApplyJobScreen;
