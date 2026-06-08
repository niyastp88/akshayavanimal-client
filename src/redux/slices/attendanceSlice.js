import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

export const checkIn = createAsyncThunk("attendance/checkIn", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/attendance/check-in");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Check-in failed");
  }
});

export const checkOut = createAsyncThunk("attendance/checkOut", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/attendance/check-out");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Check-out failed");
  }
});

export const getMyAttendance = createAsyncThunk("attendance/getMy", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/attendance/my");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Fetch failed");
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    today: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
        state.history.unshift(action.payload); // Add instantly to list top
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
        // Update item inside existing local array list
        const idx = state.history.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.history[idx] = action.payload;
      })
      .addCase(getMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const data = Array.isArray(action.payload) ? action.payload : [];
        state.history = data;
        const todayDate = new Date().toISOString().split("T")[0];
        state.today = data.find((a) => a.date === todayDate) || null;
      })
      .addMatcher(
        (action) => action.type.startsWith("attendance/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("attendance/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;