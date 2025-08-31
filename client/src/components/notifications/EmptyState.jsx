import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const EmptyState = ({ selectedFilter }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.emptyIconGradient}>
        <Icon name="notifications-none" size={48} color={COLORS.white} />
      </LinearGradient>
    </View>
    <Text style={styles.emptyTitle}>
      {selectedFilter === 'all' ? "You're all caught up!" : `No ${selectedFilter} notifications`}
    </Text>
    <Text style={styles.emptySubtitle}>
      {selectedFilter === 'all'
        ? "All notifications have been read"
        : `You don't have any ${selectedFilter} notifications yet`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, paddingVertical: 60,
  },
  emptyIconContainer: { marginBottom: 24 },
  emptyIconGradient: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20, fontFamily: FONTS.bold, color: COLORS.text,
    textAlign: 'center', marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16, fontFamily: FONTS.regular,
    color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22,
  },
});

export default EmptyState;
