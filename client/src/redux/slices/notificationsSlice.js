import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
