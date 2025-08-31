import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const QuickActions = ({ onContactPress }) => {
  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => onContactPress('email')}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' + '15' }]}>
          <Icon name="email" size={20} color="#4CAF50" />
        </View>
        <Text style={styles.quickActionText}>Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => onContactPress('phone')}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' + '15' }]}>
          <Icon name="phone" size={20} color="#2196F3" />
        </View>
        <Text style={styles.quickActionText}>Call</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' + '15' }]}>
          <Icon name="schedule" size={20} color="#FF9800" />
        </View>
        <Text style={styles.quickActionText}>Schedule</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionButton}>
        <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' + '15' }]}>
          <Icon name="note-add" size={20} color="#9C27B0" />
        </View>
        <Text style={styles.quickActionText}>Notes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
});

export default QuickActions;
