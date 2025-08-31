import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ApplicationCard from './ApplicationCard';

const ApplicationList = ({ applications, onApplicationPress }) => {
  return (
    <FlatList
      data={applications}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ApplicationCard 
          application={item} 
          onPress={() => onApplicationPress(item)}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default ApplicationList;
