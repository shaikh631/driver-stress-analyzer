import { createSlice } from "@reduxjs/toolkit";

// Restore auth state from localStorage on load
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('userData');

const initialState = {
  status: !!savedToken,
  userData: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userData', JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('driverSession');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;