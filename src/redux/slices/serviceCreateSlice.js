import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// 1. Create Service Action
export const createService = createAsyncThunk(
  "service/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/services", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create service");
    }
  }
);

// 2. Fetch Services Action (ഇതാണ് ഫോം പേജ് വിളിക്കുന്നത്)
export const fetchServices = createAsyncThunk(
  "service/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      // FormPage-ൽ നിന്ന് { page: 1, limit: 1000 } വരുമ്പോൾ അത് params വഴി Axios കൃത്യമായി കൊണ്ടുപോകും
      const res = await API.get("/services", { params }); 
      return res.data; // ബാക്ക്-എൻഡ് തരുന്ന { data: [...] } ഇവിടെ കിട്ടും
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch services");
    }
  }
);

const serviceSlice = createSlice({
  name: "services", // 🟢 FormPage-ലെ state.services ഇവിടെയാണ് കണക്റ്റ് ആകുന്നത്
  initialState: {
    data: [],       // 🟢 സർവീസുകൾ ഇവിടെയാണ് വന്ന് സ്റ്റോർ ആകുന്നത്
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetServiceState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Create Service Cases ---
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createService.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Services Cases (ഇതാണ് നമ്മൾ പുതുതായി ചേർത്തത്) ---
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        // ബാക്ക്-എൻഡ് തരുന്നത് ഒബ്‌ജക്റ്റ് ആയതുകൊണ്ട് action.payload.data എടുത്ത് സ്റ്റേറ്റിലേക്ക് മാറ്റുന്നു
        state.data = action.payload.data || []; 
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetServiceState } = serviceSlice.actions;
export default serviceSlice.reducer;