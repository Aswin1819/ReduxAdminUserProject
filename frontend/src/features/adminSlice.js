import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers, deleteUser, createUser, updateUser } from "../services/adminService";

// Thunk to fetch users
export const fetchUsersThunk = createAsyncThunk(
  "admin/fetchUsers",
  async ({ token, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await fetchUsers(token, refreshToken);
      console.log("Fetched users:", response); // Debugging log
      return response;
    } catch (error) {
      console.error("Error fetching users:", error); // Debugging log
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to create a new user
export const createUserThunk = createAsyncThunk(
  "admin/createUser",
  async ({ formData, token, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await createUser(formData, token, refreshToken);
      console.log("Created user:", response); // Debugging log
      return response;
    } catch (error) {
      console.error("Error creating user:", error); // Debugging log
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update an existing user
export const updateUserThunk = createAsyncThunk(
  "admin/updateUser",
  async ({ id, formData, token, refreshToken }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUser(id, formData, token, refreshToken);
      console.log(`Updated user (ID: ${id}):`, updatedUser); // Debugging log
      return { id, updatedUser };
    } catch (error) {
      console.error(`Error updating user (ID: ${id}):`, error); // Debugging log
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to delete a user
export const deleteUserThunk = createAsyncThunk(
  "admin/deleteUser",
  async ({ id, token, refreshToken }, { rejectWithValue }) => {
    try {
      await deleteUser(id, token, refreshToken);
      console.log(`Deleted user (ID: ${id})`); // Debugging log
      return id;
    } catch (error) {
      console.error(`Error deleting user (ID: ${id}):`, error); // Debugging log
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = {
          ...state.users,
          results: Array.isArray(action.payload.results) ? action.payload.results : [],
        };
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users.";
      })

      // Create user
      .addCase(createUserThunk.fulfilled, (state, action) => {
        if (state.users?.results) {
          state.users.results.push(action.payload);
        }
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to create user.";
      })

      // Update user
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        if (state.users?.results) {
          const index = state.users.results.findIndex((user) => user.id === action.payload.id);
          if (index !== -1) {
            state.users.results = state.users.results.map((user, i) =>
              i === index ? { ...user, ...action.payload.updatedUser } : user
            );
          }
        } else {
          console.error("state.users.results is undefined or not an array");
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to update user.";
      })

      // Delete user
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        if (state.users?.results) {
          state.users.results = state.users.results.filter((user) => user.id !== action.payload);
        } else {
          console.error("state.users.results is undefined or not an array");
        }
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete user.";
      });
  },
});

export default adminSlice.reducer;
