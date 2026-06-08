import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

export const addTransaction = createAsyncThunk(
  "transaction/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/transactions", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add transaction"
      );
    }
  }
);

export const fetchMyTransactions = createAsyncThunk(
  "transaction/my",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await API.get(`/transactions/my?from=${from}&to=${to}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

export const fetchStaffReport = createAsyncThunk(
  "transaction/staffReport",
  async ({ staffId, from, to }, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/transactions/staff-report?staffId=${staffId}&from=${from}&to=${to}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch report");
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transaction/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transaction/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/transactions/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    loading: false,
    error: null,
    success: false,
    myTransactions: [],
    staffReport: [],
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTransaction.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch My Transactions
      .addCase(fetchMyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.myTransactions = action.payload;
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Staff Report
      .addCase(fetchStaffReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffReport.fulfilled, (state, action) => {
        state.loading = false;
        state.staffReport = action.payload;
      })
      .addCase(fetchStaffReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.staffReport = state.staffReport.filter((t) => t._id !== action.payload);
        state.myTransactions = state.myTransactions.filter((t) => t._id !== action.payload);
      })
      
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const reportIndex = state.staffReport.findIndex((t) => t._id === action.payload._id);
        if (reportIndex !== -1) {
          state.staffReport[reportIndex] = action.payload;
        }
        const myTxIndex = state.myTransactions.findIndex((t) => t._id === action.payload._id);
        if (myTxIndex !== -1) {
          state.myTransactions[myTxIndex] = action.payload;
        }
      });
  },
});

export const { resetStatus } = transactionSlice.actions;
export default transactionSlice.reducer;