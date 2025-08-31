import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const SettingsHeader = ({ navigation }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.header}
  >
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Icon name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Settings</Text>
      <Text style={styles.headerSubtitle}>Manage your account and app preferences</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
});

export default SettingsHeader;
