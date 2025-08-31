import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const QuickAction = ({ icon, color, title, onPress }) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

const QuickActions = ({ onEdit, onShare }) => (
  <View style={styles.quickActionsRow}>
    <QuickAction icon="edit" color={COLORS.primary} title="Edit Profile" onPress={onEdit} />
    <QuickAction icon="share" color="#4CAF50" title="Share Profile" onPress={onShare} />
  </View>
);

const styles = StyleSheet.create({
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default QuickActions;
