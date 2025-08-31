import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const StatusActions = ({ onStatusUpdate, loading }) => {
  return (
    <View style={styles.actionContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
        style={styles.actionGradient}
      >
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onStatusUpdate('rejected')}
            disabled={loading}
          >
            <Icon name="cancel" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, { color: '#F44336' }]}>
              Reject
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.shortlistButton]}
            onPress={() => onStatusUpdate('shortlisted')}
            disabled={loading}
          >
            <Icon name="star" size={20} color="#FF9800" />
            <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>
              Shortlist
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onStatusUpdate('accepted')}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.acceptGradient}
            >
              <Icon name="check-circle" size={20} color={COLORS.white} />
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                Accept
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionGradient: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rejectButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  shortlistButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  acceptButton: {
    overflow: 'hidden',
  },
  acceptGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

export default StatusActions;
