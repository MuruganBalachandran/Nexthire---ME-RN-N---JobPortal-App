import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getNotifications } from '../services/api';
import { useApp } from '../context/AppContext';
import { getJobs, getJobApplications, getRecruiterStats } from '../services/api';
import { COLORS } from '../styles/colors';
import { FONTS, getPlatformFont } from '../styles/fonts';

// Imported modular components
import HeaderSection from '../components/home/HeaderSection';
import StatsCard from '../components/home/StatsCard';
import QuickActions from '../components/home/QuickActions';
import RecentSection from '../components/home/RecentSection';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { initializeMockNotifications } = useApp();

  const [recentJobs, setRecentJobs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recruiterStats, setRecruiterStats] = useState({ activeJobs: 0, candidates: 0, successRate: 0 });
  const [jobseekerStats, setJobseekerStats] = useState({ availableJobs: 0, applications: 0, matchRate: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const [latestUser, setLatestUser] = useState(user);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchLatestUser = async () => {
      try {
        if (user?._id) {
          const { getUserProfile } = require('../services/api');
          const latest = await getUserProfile(user._id);
          if (isMounted.current && latest && latest.data) {
            setLatestUser(latest.data);
          }
        }
      } catch (e) { console.error('Failed to fetch latest user for HomeScreen', e); }
    const fetchUnreadCount = async () => {
      try {
        const res = await getNotifications();
        const notifications = res?.data || [];
        setUnreadCount(notifications.filter(n => !n.read).length);
      } catch (e) {
        setUnreadCount(0);
      }
    };
    };
    fetchLatestUser();
    initializeMockNotifications();
    loadData();
    return () => { isMounted.current = false; };
  }, [user?._id, user?.userType]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Current user:', latestUser);
      const jobs = await getJobs();
      if (latestUser?.userType === 'jobseeker') {
        setRecentJobs(jobs.slice(0, 5));
        // Real stats for jobseeker
        const availableJobs = Array.isArray(jobs) ? jobs.length : 0;
        let applications = 0;
        try {
          const userApplications = await require('../services/api').getUserApplications(latestUser._id);
          if (userApplications && userApplications.data) {
            applications = Array.isArray(userApplications.data) ? userApplications.data.length : 0;
          }
        } catch (err) {
          console.error('Failed to fetch user applications:', err);
        }
        setJobseekerStats({ availableJobs, applications, matchRate: 0 });
      } else {
        setRecentJobs((jobs?.data || []).slice(0, 5));
      }

      if (latestUser?.userType === 'recruiter') {
        // ...existing code...
        const applications = await getJobApplications(latestUser?._id);
        setRecentApplications(Array.isArray(applications?.data) ? applications.data.slice(0, 5) : []);
        const statsResponse = await getRecruiterStats(latestUser._id);
        if (statsResponse?.success && statsResponse?.data) {
          const overview = statsResponse.data.overview || {};
          const statsData = {
            activeJobs: parseInt(overview?.activeJobs || 0, 10),
            candidates: parseInt(overview?.totalApplications || 0, 10),
            successRate: Math.round(parseFloat(overview?.successRate || 0))
          };
          setRecruiterStats(statsData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error.message);
      console.error('Error stack:', error.stack);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const jobs = await getJobs();
      setRecentJobs((jobs?.data || []).slice(0, 5));

      if (user?.userType === 'recruiter') {
        const statsResponse = await getRecruiterStats(user?._id);
        console.log('Refresh stats response:', statsResponse);
        
        if (statsResponse?.success && statsResponse?.data) {
          const overview = statsResponse.data.overview || {};
          console.log('Refresh stats overview:', overview);
          
          const statsData = {
            activeJobs: Number(overview.activeJobs || 0),
            candidates: Number(overview.totalApplications || 0),
            successRate: Number(overview.successRate || 0),
          };
          
          // Update recent data and stats
          setRecentJobs(statsResponse.data.recentJobs || []);
          setRecentApplications(statsResponse.data.recentApplications || []);
          setRecruiterStats(statsData);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const isJobSeeker = latestUser?.userType === 'jobseeker';

  return (
    <View style={styles.container}>
      <HeaderSection scrollY={scrollY} user={latestUser} unreadCount={unreadCount} />
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <StatsCard
            isJobSeeker={isJobSeeker}
            activeJobs={isJobSeeker ? jobseekerStats.availableJobs : recruiterStats.activeJobs}
            candidates={isJobSeeker ? jobseekerStats.applications : recruiterStats.candidates}
            successRate={isJobSeeker ? jobseekerStats.matchRate : recruiterStats.successRate}
          />
          <QuickActions isJobSeeker={isJobSeeker} navigation={navigation} />
          <RecentSection
            isJobSeeker={isJobSeeker}
            navigation={navigation}
            recentJobs={recentJobs}
            recentApplications={recentApplications}
          />

          {/* Bottom spacing for smoother scrolling */}
          <View style={styles.bottomSpacing} />
        </View>
      </Animated.ScrollView>
      {/* Loading Spinner Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinnerBox}>
            <Animated.View style={{ transform: [{ scale: 1.2 }] }}>
              <Animated.Text style={styles.loadingText}>Loading...</Animated.Text>
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  bottomSpacing: {
    height: 20,
  },
    loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingSpinnerBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: getPlatformFont(FONTS.medium),
    color: COLORS.primary,
  },
});

export default HomeScreen;
