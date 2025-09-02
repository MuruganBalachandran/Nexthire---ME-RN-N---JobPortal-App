import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Full Time', value: 'full-time' },
  { label: 'Part Time', value: 'part-time' },
  { label: 'Remote', value: 'remote' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
];

const JobListHeader = ({
  title = 'Jobs',
  subtitle = 'Find your next opportunity',
  showBackButton,
  onBackPress,
  searchQuery = '',
  setSearchQuery = () => {},
  filterType = 'all',
  onFilterChange = () => {},
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBarWrapper}>
          <Icon name="search" size={22} color="#e0e0e0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search jobs, companies, locations..."
            placeholderTextColor="#e0e0e0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterChip,
              filterType === filter.value && styles.filterChipActive,
            ]}
            onPress={() => onFilterChange(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                filterType === filter.value && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  searchBarContainer: {
    marginBottom: 10,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  searchBarWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.10)', // lighter, more subtle
  borderRadius: 24,
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.18)',
  // Remove heavy shadow for a flatter, modern look
  shadowColor: 'transparent',
  elevation: 0,
},
searchIcon: {
  marginRight: 8,
  color: '#d1d5db', // lighter icon
},
searchBar: {
  flex: 1,
  backgroundColor: 'transparent',
  color: COLORS.white,
  fontSize: 16,
  fontFamily: FONTS.regular,
  paddingVertical: 0,
  paddingHorizontal: 0,
  minHeight: 36,
},
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: 'bold',
  },
});

export default JobListHeader;
