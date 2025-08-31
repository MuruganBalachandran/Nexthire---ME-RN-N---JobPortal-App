import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const EmptyState = ({ searchQuery }) => {
  return (
    <View style={styles.emptyState}>
      <Icon name="work-off" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>No jobs found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery
          ? 'Try adjusting your search criteria'
          : 'Check back later for new opportunities'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EmptyState;
