import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// ------------------- Initial state
const initialState = {
  user: null,
  usersList: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
};
// Or if you use a config file, make sure it points to 3001:

//---------------------- THUNKS -----------------------------
//Register Thunk
// This thunk is used to register a new user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/registerUser`, {
        idNumber: userData.idNumber,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
      });
      return response.data.user; //return the response from the server as payload to the thunk
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed.";
      console.error("Registration error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

//Login Thunk
export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/login`, {
        email: userData.email,
        password: userData.password,
      });
      if (!response.data.user) {
        console.error("No user data in response:", response.data);
        return rejectWithValue("Invalid response from server");
      }
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error.message || error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      return rejectWithValue(errorMessage);
    }
  }
);

//Logout Thunk
export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    //logout takes no payload,so i've used "_" instead.
    try {
      const response = await api.post(`/logout`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update User Profile Thunk
export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/updateUser`, userData);
      return response.data.user;
    } catch (error) {
      console.error(
        "Update Profile error:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.error || "Failed to update user profile.";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------------------- CREATE USER SLICE ------------------------
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.usersList.push(action.payload);
    },
    deleteUser: (state, action) => {
      // Remove a user by ID number from the state.
      if (Array.isArray(state.usersList)) {
        state.usersList = state.usersList.filter(
          (user) => user.idNumber !== action.payload
        );
      }
    },
    updateUser: (state, action) => {
      // Iterate the array and compare the email with the email from the payload
      if (Array.isArray(state.usersList)) {
        state.usersList = state.usersList.map((user) =>
          user.email === action.payload.email
            ? {
                ...user,
                name: action.payload.name,
                password: action.payload.password,
              }
            : user
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //REGISTER cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      //LOGIN cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload; //assign the payload which is the user object return from the server after authentication.
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      //UPDATE USER cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      //LOGOUT cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
