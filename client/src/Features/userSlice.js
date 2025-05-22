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

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      //sends a POST request to the server along the request body object
      const response = await axios.post("http://localhost:3001/registerUser", {
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

// Create the slice
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: (state) => {
      // state.profile = null;
      // state.advisees = [];
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
