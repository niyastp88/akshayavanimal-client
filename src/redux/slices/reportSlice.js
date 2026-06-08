import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// Async thunk to fetch financial report from server with range params
export const fetchReport = createAsyncThunk(
  "report/fetch",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await API.get(`/reports`, { params: { from, to } });
      return res.data; // Expected format: { data: [], totals: {} }
    } catch (err) {
      // Gracefully capture backend error message or use a fallback
      return rejectWithValue(err.response?.data?.message || "Failed to load report data");
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    data: [],
    totals: {
      cash: 0,
      gpay: 0,
      profit: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Clear state if required upon component unmount
    clearReportState: (state) => {
      state.data = [];
      state.totals = { cash: 0, gpay: 0, profit: 0 };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loading state
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful data retrieval
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
        state.totals = action.payload.totals || { cash: 0, gpay: 0, profit: 0 };
      })
      // Handle network or server rejections
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportState } = reportSlice.actions;
export default reportSlice.reducer;