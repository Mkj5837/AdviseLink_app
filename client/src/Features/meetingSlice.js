import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMeetingsApi } from "../api/meetings";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMeetings = createAsyncThunk(
  "meetings/fetchMeetings",
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchMeetingsApi(params);
      return res.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to load meetings."
      );
    }
  }
);

const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default meetingSlice.reducer;
