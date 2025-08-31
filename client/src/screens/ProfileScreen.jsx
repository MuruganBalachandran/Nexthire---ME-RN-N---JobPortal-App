import React, { useContext, useEffect, useState, useRef } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Share,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { getNotifications, getRecruiterStats, updateUserProfile } from '../services/api';

import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCard from '../components/home/StatsCard';
import QuickActions from '../components/profile/QuickActions';
import MenuSection from '../components/profile/Menu';
import LogoutButton from '../components/profile/LogoutButton';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState({ applied: 0, interviews: 0 });
  const [recruiterStats, setRecruiterStats] = useState({ activeJobs: 0, candidates: 0, successRate: 0 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editImage, setEditImage] = useState(user?.profileImage || '');
  const [editLoading, setEditLoading] = useState(false);
  const [latestUser, setLatestUser] = useState(user);
  const isMounted = useRef(true);

  // Always fetch latest user data from MongoDB on mount and after profile update
  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      try {
        if (user?._id) {
          const { getUserProfile } = require('../services/api');
          const latest = await getUserProfile(user._id);
          if (isMounted.current && latest && latest.data) {
            setLatestUser(latest.data);
            await AsyncStorage.setItem('user', JSON.stringify(latest.data));
          }
        }
        if (user?.userType === 'recruiter') {
          const statsResponse = await getRecruiterStats(user._id);
          if (statsResponse?.success && statsResponse?.data) {
            const overview = statsResponse.data.overview || {};
            setRecruiterStats({
              activeJobs: parseInt(overview?.activeJobs || 0, 10),
              candidates: parseInt(overview?.totalApplications || 0, 10),
              successRate: Math.round(parseFloat(overview?.successRate || 0))
            });
          }
  }
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    return () => { isMounted.current = false; };
  }, [user?._id]);

  const handleLogout = async () => {
    console.log('ProfileScreen: handleLogout called');
    try {
      console.log('ProfileScreen: Executing logout');
      await logout();
      console.log('ProfileScreen: Logout successful');
      // Let the AppNavigator handle the navigation based on authentication state
    } catch (error) {
      console.error('ProfileScreen: Logout failed:', error);
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out my profile on Job Portal!`,
        // url: `https://jobportal.com/profile/${user._id}` // Replace with actual profile URL
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person',
          title: 'Personal Information',
          subtitle: 'Update your profile details',
          color: '#4CAF50',
          onPress: () => navigation.navigate('Settings', { screen: 'PersonalInfo' }),
        },
        {
          icon: 'work',
          title: user?.role === 'jobseeker' ? 'My Applications' : 'My Jobs',
          subtitle: user?.role === 'jobseeker' ? 'Track your job applications' : 'Manage posted jobs',
          color: '#FF9800',
          onPress: () => navigation.navigate('Applications'),
        },
        {
          icon: 'bookmark',
          title: user?.role === 'jobseeker' ? 'Saved Jobs' : 'Bookmarked Candidates',
          subtitle: user?.role === 'jobseeker' ? 'Your favorite opportunities' : 'Your preferred candidates',
          color: '#2196F3',
          onPress: () => navigation.navigate('SavedJobs'),
        },
        {
          icon: 'history',
          title: 'Activity History',
          subtitle: 'View your recent activity',
          color: '#9C27B0',
          onPress: () => navigation.navigate('ActivityHistory'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          title: 'Notifications',
          subtitle: `${notifications.filter(n => !n.read).length} unread notifications`,
          color: '#FF5722',
          badge: notifications.filter(n => !n.read).length > 0,
          onPress: () => navigation.navigate('Notifications'),
        },
        {
          icon: 'tune',
          title: 'Job Preferences',
          subtitle: user?.role === 'jobseeker' ? 'Set job search criteria' : 'Set hiring preferences',
          color: '#607D8B',
          onPress: () => navigation.navigate('JobPreferences'),
        },
        {
          icon: 'settings',
          title: 'App Settings',
          subtitle: 'Privacy, security & more',
          color: '#795548',
          onPress: () => navigation.navigate('Settings'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-center',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          color: '#FF9800',
          onPress: () => navigation.navigate('Settings', { screen: 'HelpSupport' }),
        },
        {
          icon: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          color: '#2196F3',
          onPress: () => navigation.navigate('Feedback'),
        },
        {
          icon: 'info',
          title: 'About',
          subtitle: 'App version and information',
          color: '#9E9E9E',
          onPress: () => navigation.navigate('Settings', { screen: 'About' }),
        },
      ],
    },
  ];

  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  // Edit profile handlers
  const openEditModal = () => {
    setEditName(latestUser?.fullName || '');
    setEditImage(latestUser?.profileImage || '');
    setEditModalVisible(true);
  };

  const handleImagePick = async () => {
    try {
      const res = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
      if (res && res[0]) {
        setEditImage(res[0].uri);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      // Prepare profile data (only name and image)
      const profileData = { fullName: editName };
      // If image changed, upload image first
      let uploadedImageUrl = editImage;
      if (editImage && editImage !== user?.profileImage && editImage.startsWith('file')) {
        // Upload image
        const formData = new FormData();
        formData.append('avatar', { uri: editImage, name: 'avatar.jpg', type: 'image/jpeg' });
        const res = await fetch(`${API_BASE_URL}/users/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) uploadedImageUrl = data.url;
        else throw new Error('Image upload failed');
      }
      if (uploadedImageUrl && uploadedImageUrl !== user?.profileImage) profileData.profileImage = uploadedImageUrl;
      // Update profile
      await updateUserProfile(profileData);
      // Fetch latest user data from backend
      if (typeof user?._id !== 'undefined') {
        const { getUserProfile } = require('../services/api');
        const latest = await getUserProfile(user._id);
        if (latest && latest.data) {
          setUser(latest.data);
          await AsyncStorage.setItem('user', JSON.stringify(latest.data));
        }
      }
      setEditModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProfileHeader user={{ ...latestUser, profileImage: editImage || latestUser?.profileImage }} onEditImage={openEditModal} />
        {latestUser?.userType === 'recruiter' ? (
          <StatsCard
            isJobSeeker={false}
            activeJobs={recruiterStats.activeJobs}
            candidates={recruiterStats.candidates}
            successRate={recruiterStats.successRate}
          />
        ) : (
          <StatsCard stats={userStats} unreadNotifications={unreadNotifications} />
        )}
        <QuickActions onEdit={openEditModal} onShare={handleShareProfile} />
        {menuSections.map((section, index) => (
          <MenuSection
            key={index}
            title={section.title}
            items={section.items}
            isLastSection={index === menuSections.length - 1}
          />
        ))}
        <LogoutButton onPress={handleLogout} />
        <View style={styles.bottomPadding} />
      </ScrollView>
      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Edit Profile</Text>
            <TouchableOpacity onPress={handleImagePick} style={{ alignSelf: 'center', marginBottom: 16 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: '#667eea', marginBottom: 8 }}>
                <Image source={{ uri: editImage || latestUser?.profileImage }} style={{ width: 100, height: 100 }} />
              </View>
              <Text style={{ color: '#667eea', textAlign: 'center' }}>Change Photo</Text>
            </TouchableOpacity>
            <TextInput value={editName} onChangeText={setEditName} placeholder="Full Name" style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 24, fontSize: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 16 }} disabled={editLoading}>
                <Text style={{ color: '#888', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditSave} disabled={editLoading} style={{ backgroundColor: '#667eea', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 }}>
                {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16 }}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;