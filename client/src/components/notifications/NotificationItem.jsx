import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { formatDate } from '../../utils/formatDate';

const getIcon = (type) => {
  switch (type) {
    case 'application': return 'assignment';
    case 'job': return 'work';
    case 'profile': return 'person';
    case 'message': return 'message';
    case 'interview': return 'event';
    default: return 'notifications';
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'application': return '#FF9800';
    case 'job': return '#4CAF50';
    case 'profile': return '#2196F3';
    case 'message': return '#9C27B0';
    case 'interview': return '#F44336';
    default: return COLORS.primary;
  }
};

const NotificationItem = ({ item, index, onPress, onMarkRead }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const [showDelete, setShowDelete] = React.useState(false);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress?.(item.id);
  };

  // Swipe left logic
  const handleSwipe = (dx) => {
    if (dx < -50) setShowDelete(true);
    else setShowDelete(false);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }, { translateX }] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              // Show confirm alert
              if (onDelete) {
                onDelete(item);
              }
            }}
          >
            <Icon name="delete" size={24} color="#F44336" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.notificationItem,
            !item.read && styles.unreadItem,
            index === 0 && styles.firstItem,
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
          onResponderMove={(e) => handleSwipe(e.nativeEvent.pageX - e.nativeEvent.locationX)}
          onResponderRelease={() => setShowDelete(false)}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '15' }]}> 
            <Icon name={getIcon(item.type)} size={24} color={getIconColor(item.type)} />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.notificationTitle, !item.read && styles.unreadTitle]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
              {/* Tick button for marking as read */}
              {!item.read && onMarkRead && (
                <TouchableOpacity onPress={() => onMarkRead(item)} style={styles.tickBtn}>
                  <Icon name="check" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{formatDate(item.timestamp, 'relative')}</Text>
              <View style={[styles.typeBadge, { backgroundColor: getIconColor(item.type) + '20' }]}>
                <Text style={[styles.typeBadgeText, { color: getIconColor(item.type) }]}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

};

const styles = StyleSheet.create({
  deleteBtn: {
    marginRight: 8,
    backgroundColor: '#fff0f0',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  firstItem: { marginTop: 4 },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: '#fefefe',
    elevation: 3,
    shadowOpacity: 0.08,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
    tickBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#e3fcec',
  },
  contentContainer: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  notificationTitle: { fontSize: 16, fontFamily: FONTS.semiBold, color: COLORS.text, flex: 1, marginRight: 8 },
  unreadTitle: { fontFamily: FONTS.bold },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  notificationMessage: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timestamp: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  typeBadgeText: { fontSize: 11, fontFamily: FONTS.medium },
});

export default NotificationItem;
