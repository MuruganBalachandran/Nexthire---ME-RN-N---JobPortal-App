import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApplicantCard from '../../components/ApplicantCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../redux/slices/jobsSlice';
import { getJobs, getJobApplications, getRecruiterStats } from '../../services/api';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { AuthContext } from '../../context/AuthContext';

const JobApplicationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { jobs, loading: jobsLoading } = useSelector(state => state.jobs);
  
  console.log('JobApplicationsScreen - User from AuthContext:', user);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobFilter, setShowJobFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug log when component mounts or user changes
  useEffect(() => {
    console.log('User from Redux:', user);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('JobApplicationsScreen - Component mounted');
      console.log('Current user:', user);
      
      if (!user) {
        console.log('Waiting for user data...');
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching data for user ID:', user._id);
        setError(null);
        
        // Fetch jobs
        await dispatch(fetchJobs({ recruiter: user._id }));
        console.log('Jobs fetched successfully');
        
        // Fetch applications
        const applicationsResponse = await getJobApplications(user._id);
        console.log('Applications API Response:', applicationsResponse);
        
        if (applicationsResponse?.success && Array.isArray(applicationsResponse.data)) {
          console.log('Setting applications:', applicationsResponse.data);
          setApplications(applicationsResponse.data);
        } else {
          console.log('Invalid applications response:', applicationsResponse);
          setApplications([]);
        }
      } catch (err) {
        console.error('Error details:', err);
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
        console.log('Loading finished');
      }
    };
    
    fetchData();
  }, [user]);

  // Set filtered applications based on search query and selected job
  useEffect(() => {
    console.log('Filtering applications:', applications);
    console.log('Current search query:', searchQuery);
    console.log('Selected job:', selectedJob);
    
    let filtered = applications || [];
    console.log('Initial filtered count:', filtered.length);
    
    // Apply search filter if there's a search query
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app?.applicant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app?.job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After search filter count:', filtered.length);
    }
    
    // Apply job filter if a job is selected
    if (selectedJob) {
      filtered = filtered.filter(app => 
        app.jobId === selectedJob.id || 
        app.jobId === selectedJob._id ||
        app.job?.id === selectedJob.id || 
        app.job?._id === selectedJob._id
      );
      console.log('After job filter count:', filtered.length);
    }
    
    console.log('Setting filtered applications:', filtered);
    setFilteredApplications(filtered);
  }, [applications, searchQuery, selectedJob]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user && user._id) {
        await dispatch(fetchJobs({ recruiter: user._id }));
        const applications = await getJobApplications(user._id);
        setApplications(Array.isArray(applications?.data) ? applications.data : []);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error?.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplicationPress = (application) => {
    console.log('Navigating to ApplicantDetail with application:', application);
    if (!application) {
      console.warn('Attempted to navigate with null/undefined application');
      return;
    }
    
    // Ensure all required fields are present
    const applicationData = {
      _id: application._id,
      applicant: application.applicant || {},
      job: application.job || {},
      status: application.status || 'pending',
      resume: application.resume || null,
      createdAt: application.createdAt || new Date().toISOString(),
      updatedAt: application.updatedAt || new Date().toISOString()
    };
    
    navigation.navigate('ApplicantDetail', { application: applicationData });
  };

  const getApplicationStats = () => {
    try {
      // Use raw applications array for stats
      const total = applications?.length || 0;
      const pending = applications?.filter(app => app?.status === 'pending')?.length || 0;
      const reviewing = applications?.filter(app => app?.status === 'reviewing')?.length || 0;
      const accepted = applications?.filter(app => app?.status === 'accepted')?.length || 0;
      
      return { total, pending, reviewing, accepted };
    } catch (err) {
      console.error('Error calculating stats:', err);
      return { total: 0, pending: 0, reviewing: 0, accepted: 0 };
    }
  };

  const renderApplication = ({ item }) => {
    if (!item) {
      console.warn('Received null/undefined item in renderApplication');
      return null;
    }

    console.log('Rendering application item:', item);
    
    return (
      <ApplicantCard
        application={item}
        onPress={() => handleApplicationPress(item)}
      />
    );
  };

  const renderJobFilter = ({ item }) => {
    const isSelected = selectedJob && (selectedJob.id === item.id || selectedJob._id === item._id);
    const applicationCount = applications?.filter(app => 
      app.jobId === item.id || 
      app.jobId === item._id || 
      app.job?.id === item.id || 
      app.job?._id === item._id
    )?.length || 0;

    return (
      <TouchableOpacity
        style={[
          styles.jobFilterItem,
          isSelected && styles.jobFilterItemActive
        ]}
        onPress={() => {
          setSelectedJob(isSelected ? null : item);
          setShowJobFilter(false);
        }}
      >
        <Text style={[
          styles.jobFilterText,
          isSelected && styles.jobFilterTextActive
        ]}>
          {item.title || 'Untitled Job'}
        </Text>
        <Text style={styles.jobFilterCount}>
          {applicationCount} applications
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    const stats = getApplicationStats();
    console.log('Rendering header with stats:', stats);

    return (
      <View style={[styles.header, { marginBottom: 10 }]}>
        <Text style={styles.headerTitle}>Job Applications</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.reviewing}</Text>
            <Text style={styles.statLabel}>Reviewing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.accepted}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search applications..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.jobFilterButton, selectedJob && styles.jobFilterButtonActive]}
            onPress={() => setShowJobFilter(!showJobFilter)}
          >
            <Icon name="filter-list" size={20} color={selectedJob ? COLORS.white : COLORS.primary} />
            <Text style={[styles.jobFilterButtonText, selectedJob && styles.jobFilterButtonTextActive]}>
              {selectedJob ? selectedJob.title : 'All Jobs'}
            </Text>
          </TouchableOpacity>
        </View>

        {showJobFilter && (
          <View style={styles.jobFilterContainer}>
            <FlatList
              data={jobs}
              renderItem={renderJobFilter}
              keyExtractor={(item) => item.id.toString()}
              style={styles.jobFilterList}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
  // Use raw applications array length, no filtering (match HomeScreen logic)
  const applicationsLength = (applications || []).length;

    return (
      <View style={styles.emptyState}>
        <Icon name="people-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>
          {applicationsLength > 0 ? 'No Matching Applications' : 'No Applications Yet ...'}
        </Text>
        <Text style={styles.emptySubtext}>
          {selectedJob || searchQuery
            ? 'Try adjusting your filters to see more applications'
            : applicationsLength > 0
              ? 'No applications match the current criteria'
              : 'Applications will appear here when candidates apply to your jobs'
          }
        </Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Always render header outside FlatList */}
      {renderHeader()}
      <FlatList
        data={filteredApplications}
        renderItem={renderApplication}
        keyExtractor={(item) => item?._id?.toString() || item?.id?.toString()}
        ListEmptyComponent={(!loading && !refreshing) ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    paddingTop: 0, // Remove any top padding
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  filterContainer: {
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 10,
  },
  jobFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  jobFilterButtonActive: {
    backgroundColor: COLORS.primaryDark,
  },
  jobFilterButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 8,
  },
  jobFilterButtonTextActive: {
    color: COLORS.white,
  },
  jobFilterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  jobFilterList: {
    flexGrow: 0,
  },
  jobFilterItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  jobFilterItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  jobFilterText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  jobFilterTextActive: {
    color: COLORS.primary,
  },
  jobFilterCount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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

export default JobApplicationsScreen;

