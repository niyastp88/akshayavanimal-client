import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// Fetch dashboard data for admin users
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchAdminData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/dashboard");
      return response.data;
    } catch (error) {
      // Return custom error message from backend if available
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin dashboard");
    }
  }
);

// Fetch dashboard data for staff members
export const fetchStaffDashboard = createAsyncThunk(
  "dashboard/fetchStaffData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/dashboard/staff");
      return response.data;
    } catch (error) {
      // Fallback to generic message if network error occurs
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {},
    loading: false,
    error: null, // Track error messages globally
  },
  reducers: {
    // Reset state to initial values when needed (e.g., on logout)
    clearDashboard: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle admin dashboard api lifecycle states
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle staff dashboard api lifecycle states
      .addCase(fetchStaffDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStaffDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;