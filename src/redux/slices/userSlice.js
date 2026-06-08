import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// Fetch all staff users
export const fetchStaffUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/users");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff list");
    }
  }
);

// Create staff
export const createStaff = createAsyncThunk(
  "users/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/users", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create staff");
    }
  }
);

// Update staff
export const updateStaffUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/users/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update staff");
    }
  }
);

// Delete staff
export const deleteStaffUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete staff");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    staffList: [],
    loading: false,
    listLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Staff Cases
      .addCase(fetchStaffUsers.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchStaffUsers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.staffList = action.payload;
      })
      .addCase(fetchStaffUsers.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })
      
      // Create Staff Cases
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.staffList.push(action.payload);
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Staff Cases
      .addCase(updateStaffUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaffUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.staffList.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.staffList[index] = action.payload;
        }
      })
      .addCase(updateStaffUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Staff Cases
      .addCase(deleteStaffUser.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter((u) => u._id !== action.payload);
      });
  },
});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;