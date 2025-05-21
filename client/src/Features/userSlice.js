import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersData } from "../ExampleData";
import axios from "axios";

// Initial state
const initialState = { value: UsersData };
console.log(initialState);
// const initialState = {
//   profile: null,
//   advisees: [],
//   loading: false,
//   error: null,
// };

// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Get user profile
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch user profile"
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/users/${userData.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  }
);

// Get advisees list (for advisors)
export const getAdviseesList = createAsyncThunk(
  "user/getAdvisees",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/users/advisees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch advisees"
      );
    }
  }
);

// Create the slice
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: (state) => {
      state.profile = null;
      state.advisees = [];
      state.loading = false;
      state.error = null;
    },
    addUser: (state, action) => {
      state.value.push(action.payload);
    },
    deleteUser: (state, action) => {
      // Remove a user by email from the state
      if (Array.isArray(state.value)) {
        state.value = state.value.filter(
          (user) => user.email !== action.payload
        );
      }
    },
    updateUser: (state, action) => {
      // Iterate the array and compare the email with the email from the payload
      if (Array.isArray(state.value)) {
        state.value = state.value.map((user) =>
          user.email === action.payload.email
            ? { ...user, name: action.payload.name, password: action.payload.password }
            : user
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get advisees list cases
      .addCase(getAdviseesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdviseesList.fulfilled, (state, action) => {
        state.loading = false;
        state.advisees = action.payload;
      })
      .addCase(getAdviseesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearUserError, resetUserState, addUser, deleteUser, updateUser} =
  userSlice.actions;
export default userSlice.reducer;
