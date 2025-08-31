import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import JobCard from '../../components/JobCard';
import JobListHeader from '../../components/jobseeker/jobs/JobListHeader';
import EmptyState from '../../components/jobseeker/jobs/EmptyState';
import { fetchSavedJobs, unsaveJob } from '../../redux/slices/jobsSlice';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const SavedJobsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector(state => state.jobs);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadSavedJobs();
  }, [dispatch]);

  const loadSavedJobs = async () => {
    try {
      await dispatch(fetchSavedJobs());
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedJobs();
    setRefreshing(false);
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetail', { job });
  };

  const handleUnsaveJob = (jobId) => {
    dispatch(unsaveJob(jobId));
  };

  const getFilteredJobs = () => {
    if (filterType === 'all') return savedJobs;
    return savedJobs.filter(job => job.type === filterType);
  };

  const renderJob = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item)}
      rightAction={() => (
        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={() => handleUnsaveJob(item._id)}
        >
          <Icon name="bookmark" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    />
  );

  const renderHeader = () => (
    <JobListHeader
      title="Saved Jobs"
      subtitle="Track and manage your saved positions"
      filterType={filterType}
      onFilterChange={setFilterType}
      totalJobs={savedJobs.length}
      showBackButton={true}
      onBackPress={() => navigation.goBack()}/>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="bookmark-border"
      title="No Saved Jobs"
      message="Jobs you save will appear here. Save jobs to easily find and apply to them later."
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={getFilteredJobs()}
        renderItem={renderJob}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  unsaveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
});

export default SavedJobsScreen;
