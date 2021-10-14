// isLoggedIn: false, login(), logout()
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, userId: null, token: null },
  reducers: {
    login(state, action) {
      const user = action.payload;
      state.userId = user.id;
      state.token = user.token;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
