import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../../api/api";

// Get my balance transactions
export const fetchMyBalance =
  createAsyncThunk(
    "balance/my",
    async (
      { from, to },
      { rejectWithValue }
    ) => {
      try {
        const res = await API.get(
          `/balance-tx/my?from=${from}&to=${to}`
        );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load records"
        );
      }
    }
  );

// Get all balance transactions
export const fetchAllBalance =
  createAsyncThunk(
    "balance/all",
    async (
      { from, to, staffId },
      { rejectWithValue }
    ) => {
      try {
        const res = await API.get(
          `/balance-tx/all?from=${from}&to=${to}&staffId=${staffId || ""}`
        );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load records"
        );
      }
    }
  );

// Get opening balance
export const fetchOpeningBalance =
  createAsyncThunk(
    "balance/opening",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.get("/balance");

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load balance"
        );
      }
    }
  );

// Save opening balance
export const saveOpeningBalance =
  createAsyncThunk(
    "balance/saveOpening",
    async (
      data,
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.post(
            "/balance",
            data
          );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to save balance"
        );
      }
    }
  );

// Get balance types
export const fetchBalanceTypes =
  createAsyncThunk(
    "balance/types",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.get(
            "/add-balance"
          );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load types"
        );
      }
    }
  );

// Create balance transaction
export const createBalanceTx =
  createAsyncThunk(
    "balance/createTx",
    async (
      data,
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.post(
            "/balance-tx",
            data
          );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to add balance"
        );
      }
    }
  );

// Delete balance transaction
export const deleteBalance =
  createAsyncThunk(
    "balance/delete",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        await API.delete(
          `/balance-tx/${id}`
        );

        return id;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Delete failed"
        );
      }
    }
  );

// Update balance transaction
export const updateBalance =
  createAsyncThunk(
    "balance/update",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.put(
            `/balance-tx/${id}`,
            data
          );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Update failed"
        );
      }
    }
  );

  // Create balance type
export const createBalanceType =
  createAsyncThunk(
    "balance/createType",
    async (
      data,
      { rejectWithValue }
    ) => {
      try {

        const res =
          await API.post(
            "/add-balance",
            data
          );

        return res.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create type"
        );
      }
    }
  );

const balanceSlice =
  createSlice({
    name: "balance",

    initialState: {
      data: [],
      openingBalance: null,
      types: [],

      loading: false,
      saveLoading: false,

      error: null,
      success: false,
    },

    reducers: {
      resetBalanceStatus: (
        state
      ) => {
        state.success = false;
        state.error = null;
      },
    },

    extraReducers: (
      builder
    ) => {

      builder

        // Fetch my balance

        .addCase(
          fetchMyBalance.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchMyBalance.fulfilled,
          (state, action) => {
            state.loading = false;
            state.data =
              action.payload;
          }
        )

        .addCase(
          fetchMyBalance.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // Fetch all balance

        .addCase(
          fetchAllBalance.fulfilled,
          (state, action) => {
            state.data =
              action.payload;
          }
        )

        // Fetch opening balance

        .addCase(
          fetchOpeningBalance.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchOpeningBalance.fulfilled,
          (state, action) => {
            state.loading = false;

            state.openingBalance =
              action.payload;
          }
        )

        .addCase(
          fetchOpeningBalance.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // Save opening balance

        .addCase(
          saveOpeningBalance.pending,
          (state) => {
            state.saveLoading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          saveOpeningBalance.fulfilled,
          (state, action) => {
            state.saveLoading = false;
            state.success = true;

            state.openingBalance =
              action.payload;
          }
        )

        .addCase(
          saveOpeningBalance.rejected,
          (state, action) => {
            state.saveLoading = false;

            state.error =
              action.payload;
          }
        )

        // Fetch balance types

        .addCase(
          fetchBalanceTypes.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchBalanceTypes.fulfilled,
          (state, action) => {
            state.loading = false;

            state.types =
              action.payload;
          }
        )

        .addCase(
          fetchBalanceTypes.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // Create transaction

        .addCase(
          createBalanceTx.pending,
          (state) => {
            state.saveLoading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          createBalanceTx.fulfilled,
          (state, action) => {
            state.saveLoading = false;
            state.success = true;

            state.data.unshift(
              action.payload
            );
          }
        )

        .addCase(
          createBalanceTx.rejected,
          (state, action) => {
            state.saveLoading = false;

            state.error =
              action.payload;
          }
        )

        // Delete transaction

        .addCase(
          deleteBalance.fulfilled,
          (state, action) => {
            state.data =
              state.data.filter(
                (item) =>
                  item._id !==
                  action.payload
              );
          }
        )

        // Update transaction

        .addCase(
          updateBalance.fulfilled,
          (state, action) => {

            const index =
              state.data.findIndex(
                (item) =>
                  item._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.data[index] =
                action.payload;
            }
          }
        )

        .addCase(
          updateBalance.rejected,
          (state, action) => {
            state.error =
              action.payload;
          }
        )
        // Create balance type

.addCase(
  createBalanceType.pending,
  (state) => {
    state.saveLoading = true;
    state.error = null;
    state.success = false;
  }
)

.addCase(
  createBalanceType.fulfilled,
  (state, action) => {

    state.saveLoading = false;

    state.success = true;

    state.types.push(
      action.payload
    );
  }
)

.addCase(
  createBalanceType.rejected,
  (state, action) => {

    state.saveLoading = false;

    state.error =
      action.payload;
  }
);
    },
  });

export const {
  resetBalanceStatus,
} = balanceSlice.actions;

export default balanceSlice.reducer;