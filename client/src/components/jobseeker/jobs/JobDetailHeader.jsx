import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusBadge from '../../StatusBadge';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const JobDetailHeader = ({ job, navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{job.title}</Text>
    <View style={styles.placeholder} />
  </View>
);

const JobIntro = ({ job }) => (
  <View style={styles.intro}>
    <Text style={styles.company}>{job.company}</Text>
    <View style={styles.badgeContainer}>
      <StatusBadge status={job.type} />
      <StatusBadge status={job.remote ? 'Remote' : 'On-site'} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  intro: {
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  company: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export { JobDetailHeader, JobIntro };
