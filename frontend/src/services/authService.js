import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/';
const USER_API_URL = 'http://127.0.0.1:8000/api/users/';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login/`, credentials);
    return {
      access: response.data.access,
      refresh: response.data.refresh, // Include refresh token
    };
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data.access; // Return the new access token
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register/`, userData);
    return response.data; // Return response data for confirmation
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getProfile = async (token, refreshToken) => {
  try {
    console.log("Inside getProfile");
    console.log("Token being sent:", token);
    const response = await axios.get(`${USER_API_URL}profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 && error.response?.data?.code === 'token_not_valid') {
      console.log("Access token expired. Attempting to refresh...");
      const newAccessToken = await refreshAccessToken(refreshToken);
      console.log("New access token:", newAccessToken);
      // Retry the request with the new access token
      const retryResponse = await axios.get(`${USER_API_URL}profile/`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      return retryResponse.data;
    }
    console.error("Fetching profile failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const fetchUserProfile = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve access token
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token
    if (!accessToken || !refreshToken) {
      throw new Error('No tokens found');
    }
    const profile = await getProfile(accessToken, refreshToken); // Call getProfile
    console.log('User Profile:', profile);
    return profile; // Return the profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const uploadProfileImage = async (token, data) => {
  try {
    const response = await axios.post(`${USER_API_URL}upload-profile-image/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the updated user data
  } catch (error) {
    console.error("Error updating profile image:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};