import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import adminReducer from "../features/adminSlice"
import counterReducer from "../features/counterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin:adminReducer,
    counter:counterReducer,
  },
});
