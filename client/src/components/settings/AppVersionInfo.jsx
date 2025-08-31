import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const AppVersionInfo = () => (
  <View style={styles.versionContainer}>
    <View style={styles.versionCard}>
      <Icon name="info-outline" size={24} color={COLORS.primary} />
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Job Portal v1.0.0</Text>
        <Text style={styles.versionSubtext}>Last updated: 2024-07-26</Text>
      </View>
    </View>
    <Text style={styles.copyrightText}>© 2024 Job Portal. All rights reserved.</Text>
  </View>
);

const styles = StyleSheet.create({
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  versionCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  versionInfo: {
    marginLeft: 12,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  versionSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.textDisabled,
    textAlign: 'center',
  },
});

export default AppVersionInfo;
