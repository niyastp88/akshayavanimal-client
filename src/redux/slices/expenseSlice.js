import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../../api/api";


// Get my expenses
export const fetchMyExpenses =
  createAsyncThunk(
    "expense/my",
    async (
      { from, to },
      { rejectWithValue }
    ) => {
      try {

        const res =
          await API.get(
            `/expenses/my?from=${from}&to=${to}`
          );

        return res.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to load expenses"
        );
      }
    }
  );


// Get all expenses
export const fetchAllExpenses =
  createAsyncThunk(
    "expense/all",
    async (
      {
        from,
        to,
        staffId,
      },
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.get(
            `/expenses/all?from=${from}&to=${to}&staffId=${staffId || ""}`
          );

        return res.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to load expenses"
        );
      }
    }
  );


// Get expense types
export const fetchExpenseTypes =
  createAsyncThunk(
    "expense/types",
    async (
      { page = 1, limit = 5 },
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.get(
            `/expenses?page=${page}&limit=${limit}`
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


// Create expense type
export const createExpenseType =
  createAsyncThunk(
    "expense/createType",
    async (
      data,
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.post(
            "/expenses",
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


// Update expense type
export const updateExpenseType =
  createAsyncThunk(
    "expense/updateType",
    async (
      { id, data },
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.put(
            `/expenses/type/${id}`,
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


// Delete expense type
export const deleteExpenseType =
  createAsyncThunk(
    "expense/deleteType",
    async (
      id,
      { rejectWithValue }
    ) => {

      try {

        await API.delete(
          `/expenses/type/${id}`
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


// Delete expense transaction
export const deleteExpense =
  createAsyncThunk(
    "expense/delete",
    async (
      id,
      { rejectWithValue }
    ) => {

      try {

        await API.delete(
          `/expenses/${id}`
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


// Update expense transaction
export const updateExpense =
  createAsyncThunk(
    "expense/update",
    async (
      { id, data },
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.put(
            `/expenses/${id}`,
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

  // Create expense transaction
export const createExpenseTx =
  createAsyncThunk(
    "expense/createTx",
    async (
      data,
      { rejectWithValue }
    ) => {

      try {

        const res =
          await API.post(
            "/expenses/add",
            data
          );

        return res.data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to add expense"
        );
      }
    }
  );



const expenseSlice =
  createSlice({

    name: "expense",

    initialState: {

      data: [],

      types: [],

      page: 1,

      totalPages: 1,

      total: 0,

      loading: false,

      saveLoading: false,

      error: null,

      success: false,
    },

    reducers: {

      resetExpenseStatus:
        (state) => {

          state.success =
            false;

          state.error =
            null;
        },
    },

    extraReducers:
      (builder) => {

        builder

          // Fetch my expenses

          .addCase(
            fetchMyExpenses.fulfilled,
            (
              state,
              action
            ) => {

              state.data =
                action.payload;
            }
          )

          // Fetch all expenses

          .addCase(
            fetchAllExpenses.fulfilled,
            (
              state,
              action
            ) => {

              state.data =
                action.payload;
            }
          )

          // Fetch expense types

          .addCase(
            fetchExpenseTypes.pending,
            (state) => {

              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            fetchExpenseTypes.fulfilled,
            (
              state,
              action
            ) => {

              state.loading =
                false;

              state.types =
                action.payload.data;

              state.page =
                action.payload.page;

              state.totalPages =
                action.payload.totalPages;

              state.total =
                action.payload.total;
            }
          )

          .addCase(
            fetchExpenseTypes.rejected,
            (
              state,
              action
            ) => {

              state.loading =
                false;

              state.error =
                action.payload;
            }
          )

          // Create expense type

          .addCase(
            createExpenseType.pending,
            (state) => {

              state.saveLoading =
                true;

              state.error =
                null;

              state.success =
                false;
            }
          )

          .addCase(
            createExpenseType.fulfilled,
            (
              state
            ) => {

              state.saveLoading =
                false;

              state.success =
                true;
            }
          )

          .addCase(
            createExpenseType.rejected,
            (
              state,
              action
            ) => {

              state.saveLoading =
                false;

              state.error =
                action.payload;
            }
          )

          // Update expense type

          .addCase(
            updateExpenseType.pending,
            (state) => {

              state.saveLoading =
                true;

              state.error =
                null;

              state.success =
                false;
            }
          )

          .addCase(
            updateExpenseType.fulfilled,
            (
              state,
              action
            ) => {

              state.saveLoading =
                false;

              state.success =
                true;

              const index =
                state.types.findIndex(
                  (item) =>
                    item._id ===
                    action.payload._id
                );

              if (
                index !== -1
              ) {

                state.types[
                  index
                ] =
                  action.payload;
              }
            }
          )

          .addCase(
            updateExpenseType.rejected,
            (
              state,
              action
            ) => {

              state.saveLoading =
                false;

              state.error =
                action.payload;
            }
          )

          // Delete expense type

          .addCase(
            deleteExpenseType.fulfilled,
            (
              state,
              action
            ) => {

              state.types =
                state.types.filter(
                  (item) =>
                    item._id !==
                    action.payload
                );
            }
          )

          // Delete transaction

          .addCase(
            deleteExpense.fulfilled,
            (
              state,
              action
            ) => {

              state.data =
                state.data.filter(
                  (x) =>
                    x._id !==
                    action.payload
                );
            }
          )

          // Update transaction

          .addCase(
            updateExpense.fulfilled,
            (
              state,
              action
            ) => {

              const index =
                state.data.findIndex(
                  (x) =>
                    x._id ===
                    action.payload._id
                );

              if (
                index !== -1
              ) {

                state.data[
                  index
                ] =
                  action.payload;
              }
            }
          )
          // Create expense transaction

.addCase(
  createExpenseTx.pending,
  (state) => {

    state.saveLoading =
      true;

    state.error = null;

    state.success =
      false;
  }
)

.addCase(
  createExpenseTx.fulfilled,
  (
    state,
    action
  ) => {

    state.saveLoading =
      false;

    state.success =
      true;

    state.data.unshift(
      action.payload
    );
  }
)

.addCase(
  createExpenseTx.rejected,
  (
    state,
    action
  ) => {

    state.saveLoading =
      false;

    state.error =
      action.payload;
  }
);
      },
  });

export const {
  resetExpenseStatus,
} =
  expenseSlice.actions;

export default
expenseSlice.reducer;