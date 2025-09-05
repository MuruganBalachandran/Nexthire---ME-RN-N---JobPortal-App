import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from '../../components/JobCard';
import JobListHeader from '../../components/jobseeker/jobs/JobListHeader';
import EmptyState from '../../components/jobseeker/jobs/EmptyState';
import { fetchJobs } from '../../redux/slices/jobsSlice';
import { COLORS } from '../../styles/colors';

const JobListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Initial fetch
  useEffect(() => {
    dispatch(fetchJobs()).unwrap().catch((err) => {
      console.error('Error fetching jobs:', err);
    });
  }, [dispatch]);

  // Filter jobs based on search and filterType
  useEffect(() => {
    let filtered = jobs;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'all') {
      if (filterType === 'remote') {
        filtered = filtered.filter((job) => job.remote === true);
      } else {
        filtered = filtered.filter((job) => job.type === filterType);
      }
    }
    setFilteredJobs(filtered);
  }, [searchQuery, filterType, jobs]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchJobs())
      .unwrap()
      .finally(() => setRefreshing(false));
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetail', { job });
  };

  const renderJob = ({ item }) => (
    <JobCard job={item} onPress={() => handleJobPress(item)} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <JobListHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) =>
          item.id?.toString?.() || item._id?.toString?.()
        }
        ListEmptyComponent={!loading && <EmptyState searchQuery={searchQuery} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinnerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default JobListScreen;
