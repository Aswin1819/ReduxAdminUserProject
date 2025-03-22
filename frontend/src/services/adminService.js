import axios from "axios";
import { refreshAccessToken } from './authService' // Import the refreshAccessToken function
import { store } from "../store/store";// Import the Redux store to dispatch actions

const API_URL = "http://127.0.0.1:8000/api/admin/";

// Helper function to get a valid token
const getValidToken = async (token, refreshToken) => {
  try {
    if (!token || !refreshToken) {
      throw new Error("No tokens available");
    }

    // Optionally, check if the token is expired (if you have a way to decode and check expiration)
    const newAccessToken = await refreshAccessToken(refreshToken);
    console.log("New access token:", newAccessToken); // Debugging log

    // Update the Redux state with the new token
    store.dispatch({ type: "auth/updateAccessToken", payload: newAccessToken });

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Fetch users with token handling
export const fetchUsers = async (token, refreshToken) => {
  try {
    const validToken = await getValidToken(token, refreshToken); // Ensure the token is valid
    console.log("Token being sent:", validToken);
    const response = await axios.get(`${API_URL}users/`, {
      headers: {
        Authorization: `Bearer ${validToken}`, // Use the valid token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching users failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Delete user with token handling
export const deleteUser = async (userId, token, refreshToken) => {
  try {
    const validToken = await getValidToken(token, refreshToken); // Ensure the token is valid
    await axios.delete(`${API_URL}users/${userId}/delete/`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
  } catch (error) {
    console.error(`Deleting user with ID ${userId} failed:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Create user with token handling
export const createUser = async (userData, token, refreshToken) => {
  try {
    const validToken = await getValidToken(token, refreshToken); // Ensure the token is valid
    const response = await axios.post(`${API_URL}users/create/`, userData, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Creating user failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Update user with token handling
export const updateUser = async (userId, userData, token, refreshToken) => {
  try {
    const validToken = await getValidToken(token, refreshToken); // Ensure the token is valid
    const response = await axios.put(`${API_URL}users/${userId}/`, userData, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Updating user with ID ${userId} failed:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
