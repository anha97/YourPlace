// isLoggedIn: false, login(), logout()
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, userId: null },
  reducers: {
    login(state, action) {
      const user = action.payload;
      state.isLoggedIn = true;
      state.userId = user.id;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
