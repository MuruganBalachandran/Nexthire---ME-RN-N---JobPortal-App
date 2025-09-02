import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InfoRow from '../../components/jobseeker/jobs/InfoRow';
import { JobDetailHeader, JobIntro } from '../../components/jobseeker/jobs/JobDetailHeader';
import { getUserApplications } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { formatDate } from '../../utils/formatDate';


const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    const checkIfApplied = async () => {
      setLoading(true);
      try {
        const res = await getUserApplications();
        // Support both { success, data } and array response
        const applications = Array.isArray(res) ? res : res.data || [];
        const found = applications.find(
          (app) => app.job && (app.job._id === job._id || app.job === job._id)
        );
        if (found) {
          setHasApplied(true);
          setApplicationId(found._id);
        } else {
          setHasApplied(false);
          setApplicationId(null);
        }
      } catch (e) {
        setHasApplied(false);
        setApplicationId(null);
      } finally {
        setLoading(false);
      }
    };
    if (user && job && job._id) checkIfApplied();
  }, [user, job]);

  const handleApply = () => {
    navigation.navigate('ApplyJob', { job });
  };

  const handleTrack = () => {
    if (applicationId) {
      navigation.navigate('Applications');
    }
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
            <InfoRow icon="category" label="Job Type" value={job.type} />
            <InfoRow icon="home-work" label="Remote" value={job.remote ? 'Yes' : 'No'} />
            {job.skills && (
              <InfoRow icon="psychology" label="Skills" value={Array.isArray(job.skills) ? job.skills.join(', ') : job.skills} />
            )}
            {job.industry && (
              <InfoRow icon="business-center" label="Industry" value={job.industry} />
            )}
            {job.level && (
              <InfoRow icon="trending-up" label="Level" value={job.level} />
            )}
            {job.education && (
              <InfoRow icon="school" label="Education" value={job.education} />
            )}
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

      {/* Footer with Apply/Track Button */}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : hasApplied ? (
          <TouchableOpacity
            style={[styles.applyButton, styles.disabledButton]}
            onPress={handleTrack}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Already Applied - Track Application</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Apply Now</Text>
          </TouchableOpacity>
        )}
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
