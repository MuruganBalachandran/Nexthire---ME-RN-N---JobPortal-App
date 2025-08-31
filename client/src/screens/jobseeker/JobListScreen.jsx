import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
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

  // Initial fetch
  useEffect(() => {
    dispatch(fetchJobs()).unwrap().catch((err) => {
      console.error('Error fetching jobs:', err);
    });
  }, [dispatch]);

  // Filter jobs based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredJobs(jobs);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title?.toLowerCase().includes(q) ||
            job.company?.toLowerCase().includes(q) ||
            job.location?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, jobs]);

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
      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) =>
          item.id?.toString?.() || item._id?.toString?.()
        }
        ListHeaderComponent={
          <JobListHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
        ListEmptyComponent={!loading && <EmptyState searchQuery={searchQuery} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

export default JobListScreen;
