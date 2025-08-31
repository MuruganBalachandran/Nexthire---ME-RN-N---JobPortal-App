export const postJob = createAsyncThunk(
  'jobs/postJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const res = await api.postJob(jobData);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

const initialState = {
  jobs: [],
  savedJobs: [],
  loading: false,
  error: null,
  filters: {},
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await api.getJobs(filters);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  'jobs/fetchSavedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getSavedJobs();
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  'jobs/saveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.saveJob(jobId);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unsaveJob = createAsyncThunk(
  'jobs/unsaveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.unsaveJob(jobId);
      return jobId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Post Job
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Saved Jobs
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save Job
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs.unshift(action.payload);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Unsave Job
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(job => job._id !== action.payload);
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
