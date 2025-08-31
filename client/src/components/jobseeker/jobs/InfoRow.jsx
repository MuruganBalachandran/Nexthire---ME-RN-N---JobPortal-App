import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} color={COLORS.primary} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>
        {label === 'Salary' && typeof value === 'object' && value !== null
          ? `${value.currency} ${value.min.toLocaleString()} - ${value.max.toLocaleString()} ${value.period}`
          : value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
});

export default InfoRow;
