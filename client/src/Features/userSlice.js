import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersData } from "../ExampleData";
import axios from "axios";
import * as ENV from "../config";

// Initial state
const initialState = {
  value: UsersData,
  isError: false,
  isSuccess: false,
};
console.log(initialState);

// API base URL
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";

//Register Thunk
// This thunk is used to register a new user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      // Use SERVER_URL from environment variable
      const response = await axios.post(`${SERVER_URL}/registerUser`, {
        idNumber: userData.idNumber,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        userType: userData.userType,
        // avatar: userData.avatar,
      });
      console.log(response);
      const user = response.data.user; //retrieve the response from the server
      return user; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

//Login Thunk
//This thunk is used to login a user
export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        email: userData.email,
        password: userData.password,
      });
      return response.data.user; // or response.data, depending on your backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

//Logout Thunk
// This thunk is used to log out a user
export const logout = createAsyncThunk("/users/logout", async () => {
  try {
    await axios.post(`${SERVER_URL}/logout`);
  } catch (error) {}
});

// Update User Profile Thunk
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile", // Action type string for Redux
  async (userData, { rejectWithValue }) => {
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("email", userData.email);
      formData.append("name", userData.name);
      formData.append("password", userData.password);
      if (userData.profilePic) {
        formData.append("profilePic", userData.profilePic);
      }

      const response = await axios.put(
        `${SERVER_URL}/updateUserProfile/${userData.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the updated user data from the server response
      const user = response.data.user;

      // Return the updated user data, which will be used by Redux to update the state
      return user;
    } catch (error) {
      // Log any errors that occur during the request
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
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
      state.isError = null;
    },
    resetUserState: (state) => {
      state.loading = false;
      state.isError = null;
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
            ? {
                ...user,
                name: action.payload.name,
                password: action.payload.password,
              }
            : user
        );
      }
    },
    logout: (state) => {
      state.user = null;
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) //end of register user cases
      //start of login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload; //assign the payload which is the user object return from the server after authentication.
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message; // Capture the error message
        console.error("Login failed:", action.error.message); // Log the error message
      })
      // Add cases for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // Update the current logged-in user
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      //Cases for logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export actions and reducer
export const {
  clearUserError,
  resetUserState,
  addUser,
  deleteUser,
  updateUser,
} = userSlice.actions;
export default userSlice.reducer;
