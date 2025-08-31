import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InfoRow from '../../components/jobseeker/jobs/InfoRow';
import { JobDetailHeader, JobIntro } from '../../components/jobseeker/jobs/JobDetailHeader';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { formatDate } from '../../utils/formatDate';

const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    navigation.navigate('ApplyJob', { job });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <JobDetailHeader job={job} navigation={navigation} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Company + badges */}
        <JobIntro job={job} />

        {/* Info Rows */}
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <InfoRow icon="location-on" label="Location" value={job.location} />
            <InfoRow icon="attach-money" label="Salary" value={job.salary} />
            <InfoRow icon="schedule" label="Posted" value={formatDate(job.postedDate)} />
            <InfoRow icon="work" label="Experience" value={job.experience} />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements?.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          {job.benefits && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Benefits</Text>
              {job.benefits.map((benefit, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Icon name="star" size={16} color={COLORS.warning} />
                  <Text style={styles.requirementText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer with Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyButton, hasApplied && styles.disabledButton]}
          onPress={handleApply}
          disabled={hasApplied}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {hasApplied ? 'Already Applied' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  infoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12 },
  disabledButton: { backgroundColor: COLORS.textSecondary },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
});

export default JobDetailScreen;
