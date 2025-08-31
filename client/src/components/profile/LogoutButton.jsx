import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const LogoutButton = ({ onPress }) => (
  <TouchableOpacity 
    style={styles.logoutButton} 
    onPress={onPress}
  >
    <LinearGradient
      colors={['#ff4757', '#ff6b81']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.logoutGradient}
    >
      <Icon name="exit-to-app" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </LinearGradient>
  </TouchableOpacity>
);const styles = StyleSheet.create({
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 20,
    marginTop: 32,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default LogoutButton;
