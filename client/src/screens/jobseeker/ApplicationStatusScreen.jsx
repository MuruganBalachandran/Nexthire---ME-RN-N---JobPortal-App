import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../../redux/slices/applicationsSlice';
import ApplicationCard from '../../components/jobseeker/applications/ApplicationCard';
import EmptyState from '../../components/jobseeker/applications/EmptyState';
import ApplicationsHeader from '../../components/jobseeker/applications/ApplicationsHeader';
import { COLORS } from '../../styles/colors';

const ApplicationStatusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch, user]);

  const onRefresh = () => {
    setRefreshing(true);
    if (user && user._id) {
      dispatch(fetchUserApplications(user._id)).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return COLORS.warning;
      case 'reviewing':
        return COLORS.info;
      case 'accepted':
        return COLORS.success;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'schedule';
      case 'reviewing':
        return 'visibility';
      case 'accepted':
        return 'check-circle';
      case 'rejected':
        return 'cancel';
      default:
        return 'help';
    }
  };

  return (
    <View style={styles.container}>
      <ApplicationsHeader count={applications.length} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={({ item }) => (
            <ApplicationCard
              item={item}
              navigation={navigation}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}
          keyExtractor={(item) => item.id?.toString?.() || item._id?.toString?.()}
          ListEmptyComponent={<EmptyState navigation={navigation} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApplicationStatusScreen;
