import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const ProfileHeader = ({ user }) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.headerGradient}
  >
    <View style={styles.headerContent}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: user?.profileImage || `https://via.placeholder.com/120x120/667eea/FFFFFF?text=${user?.fullName?.charAt(0) || 'U'}`
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Icon name="camera-alt" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
  <Text style={styles.name}>{user?.fullName || 'User Name'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <View style={styles.roleContainer}>
        <Icon 
          name={user?.userType === 'jobseeker' ? 'work' : 'business'} 
          size={16} 
          color={COLORS.white} 
        />
        <Text style={styles.role}>
          {user?.userType === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
        </Text>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  headerGradient: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 16,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  role: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileHeader;
