import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../../api/api";

// Fetch services
export const fetchServices = createAsyncThunk(
  "services/fetch",

  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await API.get(`/services?page=${page}&limit=10`);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load services",
      );
    }
  },
);

// Create service
export const createService = createAsyncThunk(
  "services/create",

  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/services", data);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  },
);

// Update service
export const updateService = createAsyncThunk(
  "services/update",

  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/services/${id}`, data);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

// Delete service
export const deleteService = createAsyncThunk(
  "services/delete",

  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/services/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

const serviceSlice = createSlice({
  name: "services",

  initialState: {
    data: [],

    page: 1,

    totalPages: 1,

    loading: false,

    saveLoading: false,

    success: false,

    error: null,
  },

  reducers: {
    resetServiceState: (state) => {
      state.success = false;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch

      .addCase(fetchServices.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;

        state.data = action.payload.data;

        state.page = action.payload.page;

        state.totalPages = action.payload.totalPages;
      })

      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // Create

      .addCase(createService.pending, (state) => {
        state.saveLoading = true;

        state.error = null;

        state.success = false;
      })

      .addCase(createService.fulfilled, (state) => {
        state.saveLoading = false;

        state.success = true;
      })

      .addCase(createService.rejected, (state, action) => {
        state.saveLoading = false;

        state.error = action.payload;
      })

      // Update

      .addCase(updateService.fulfilled, (state, action) => {
        state.success = true;

        const index = state.data.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // Delete

      .addCase(deleteService.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      });
  },
});

export const { resetServiceState } = serviceSlice.actions;

export default serviceSlice.reducer;
