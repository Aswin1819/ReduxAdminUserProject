import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode } from "jwt-decode";

const initialState = {
  user: null, // Stores the user object
  isAdmin: false,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const accessToken = action.payload.access;
      const refreshToken = action.payload.refresh;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Decode the access token to get user info
      const decodedToken = jwtDecode(accessToken);
      state.user = decodedToken; // Store the decoded user info
      state.isAdmin = decodedToken.is_admin || false;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAdmin = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateUserProfile: (state, action) => {
      // Update the user profile in the Redux state
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
