
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRecruiterJobs, deleteJob } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const RecruiterJobsScreen = ({ navigation }) => {
  const { user } = useAuth();
  console.log('Screen: User data from useAuth:', user);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?._id) {
        console.error('Screen: No user ID found in state');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Add more detailed logging
        console.log('Screen: Current user:', { id: user._id, type: user.userType });
        console.log('Screen: Starting to fetch jobs for recruiter:', user._id);
        
        const response = await getRecruiterJobs(user._id);
        console.log('Screen: Raw API response:', JSON.stringify(response, null, 2));
        
        if (!response) {
          throw new Error('No response received from server');
        }
        
        if (response.success && Array.isArray(response.data)) {
          console.log('Screen: Got valid jobs array. Count:', response.data.length);
          console.log('Screen: First job (if any):', response.data[0]);
          setJobs(response.data);
        } else {
          console.error('Screen: Invalid response structure:', response);
          console.error('Screen: Response type:', typeof response);
          console.error('Screen: Has success?', 'success' in response);
          console.error('Screen: Has data?', 'data' in response);
          setJobs([]);
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error('Screen: Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [user?._id]);

  const handleEdit = (job) => {
    navigation.navigate('EditJob', { job });
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      setError(err.message);
    }
  };

  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
      </View>
      <View style={styles.jobActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
          <Icon name="edit" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id || item.id)} style={styles.actionBtn}>
          <Icon name="delete" size={22} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Back button pressed');
            navigation.canGoBack() 
              ? navigation.goBack() 
              : navigation.navigate('Home');
          }} 
          style={styles.backBtn}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>My Jobs</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={item => item._id?.toString() || item.id?.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No jobs found.</Text>}
        refreshing={loading}
        onRefresh={async () => {
          if (!user?._id) {
            console.error('Screen: Cannot refresh - no user ID');
            return;
          }
          
          setLoading(true);
          setError(null);
          
          try {
            console.log('Screen: Starting refresh for recruiter:', user._id);
            console.log('Screen: User context:', { id: user._id, type: user.userType });
            
            const response = await getRecruiterJobs(user._id);
            console.log('Screen: Refresh response:', JSON.stringify(response, null, 2));
            
            if (!response) {
              throw new Error('No response received from server during refresh');
            }
            
            if (response.success && Array.isArray(response.data)) {
              console.log('Screen: Refresh successful. Jobs count:', response.data.length);
              setJobs(response.data);
            } else {
              console.error('Screen: Invalid refresh response:', response);
              setError('Invalid response from server');
              setJobs([]);
            }
          } catch (err) {
            console.error('Screen: Refresh error details:', {
              message: err.message,
              stack: err.stack,
              name: err.name
            });
            setError(err.message || 'Failed to refresh jobs');
          } finally {
            setLoading(false);
          }
        }}
      />
      {/* Loading Spinner Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinnerBox}>
            <Icon name="hourglass-empty" size={40} color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  header: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  list: {
    paddingBottom: 40,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  jobLocation: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    marginTop: 40,
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
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default RecruiterJobsScreen;
