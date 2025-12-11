import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersData } from "../ExampleData";
import axios from "axios";
import { SERVER_URL } from "../config";

// ------------------- Initial state
const initialState = {
  user: null, // Use 'user' for the current logged-in user (as used in extraReducers)
 value:null,
 isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
};
console.log(initialState);

//--------------------- API base URL
// const SERVER_URL = ENV.REACT_APP_SERVER_URL || "http://localhost:4000" || "http://localhost:3001" ;

//---------------------- THUNKS -----------------------------
//Register Thunk
// This thunk is used to register a new user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Use SERVER_URL from environment variable
      const response = await axios.post(`http://localhost:4000/registerUser`, {
        idNumber: userData.idNumber,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        gender: userData.gender,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
      });
      console.log(response);
      const user = response.data.user; //retrieve the response from the server
      return user; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || 'Registration failed.';
      console.error("Registration error:", errorMessage); 
      return rejectWithValue(errorMessage);
    }
  }
);

//Login Thunk
//This thunk is used to login a user
export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting to log in with:', { email: userData.email });      
      const response = await axios.post(`http://localhost:4000/login`, {
        email: userData.email,
        password: userData.password,
      });
      console.log('Login response:', response.data);
      if (!response.data.user) {
        console.error('No user data in response:', response.data);
        return rejectWithValue('Invalid response from server');
      }
      return response.data.user;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

//Logout Thunk
export const logout = createAsyncThunk(
  "users/logout",
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:4000/logout`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update User Profile Thunk
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile', 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:4000/updateUser`, userData);
      return response.data.user;
    } catch (error) {
      console.error('Update Profile error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to update user profile.';
      return rejectWithValue(errorMessage);
     }
  }
);

// ---------------------------- CREATE USER SLICE ------------------------
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // clearUserError: (state) => {
    //   state.isError = null;
    // },
    // resetUserState: (state) => {
    //   state.loading = false;
    //   state.isError = null;
    // },
    addUser: (state, action) => {
      state.value.push(action.payload);
    },
    deleteUser: (state, action) => {
      // Remove a user by ID number from the state.
      if (Array.isArray(state.value)) {
        state.value = state.value.filter(
          (user) => user.idNumber !== action.payload
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading= true;
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
      //start of login cases
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
      // Add cases for updateUserProfile
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
        console.log("Update error:", action.payload);
      })
      //Cases for logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state,action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  addUser,
  deleteUser,
  updateUser,
} = userSlice.actions;
export default userSlice.reducer;
