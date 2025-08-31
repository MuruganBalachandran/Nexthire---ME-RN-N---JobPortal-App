export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const res = await api.updateApplicationStatus(applicationId, status);
      return { applicationId, status, updated: res.data || res };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchUserApplications = createAsyncThunk(
  'applications/fetchUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getUserApplications();
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchJobApplications',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.getJobApplications(jobId);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
  state.loading = false;
  state.applications = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        // Update the status of the application in the state
        const idx = state.applications.findIndex(app => app.id === action.payload.applicationId || app._id === action.payload.applicationId);
        if (idx !== -1) {
          state.applications[idx].status = action.payload.status;
        }
      });
  },
});

export const { clearError } = applicationsSlice.actions;
export default applicationsSlice.reducer;
