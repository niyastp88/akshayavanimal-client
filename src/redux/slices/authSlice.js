import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../../api/api";

// Login user
export const loginUser =
  createAsyncThunk(
    "auth/login",
    async (
      credentials,
      { rejectWithValue }
    ) => {
      try {
        const res =
          await API.post(
            "/auth/login",
            credentials
          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        return res.data;

      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Login failed"
        );
      }
    }
  );

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    token:
      localStorage.getItem("token"),
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem(
        "token"
      );
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        loginUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.user =
            action.payload.user;
          state.token =
            action.payload.token;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      );
  },
});

export const { logout } =
  authSlice.actions;

export default authSlice.reducer;