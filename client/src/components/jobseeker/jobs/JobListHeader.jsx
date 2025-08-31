import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';
import { JOB_TYPES } from '../../../utils/constants';

const JobListHeader = ({ 
  title, 
  subtitle, 
  filterType, 
  onFilterChange, 
  totalJobs,
  showBackButton,
  onBackPress
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalJobs}</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'all' && styles.filterChipActive
          ]}
          onPress={() => onFilterChange('all')}
        >
          <Text style={[
            styles.filterText,
            filterType === 'all' && styles.filterTextActive
          ]}>
            All Jobs
          </Text>
        </TouchableOpacity>
        
        {JOB_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterChip,
              filterType === type.value && styles.filterChipActive
            ]}
            onPress={() => onFilterChange(type.value)}
          >
            <Text style={[
              styles.filterText,
              filterType === type.value && styles.filterTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.white,
  },
  filterText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  filterTextActive: {
    color: COLORS.primary,
  },
});

export default JobListHeader;
