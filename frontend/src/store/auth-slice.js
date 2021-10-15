// isLoggedIn: false, login(), logout()
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, userId: null, token: null, tokenExpirationDate: null },
  reducers: {
    login(state, action) {
      const user = action.payload;
      state.userId = user.id;
      state.token = user.token;
      // Storing user info in local storage so that you will be logged in after refreshing the page
      const tokenExpirationDate = user.expirationDate || new Date(
        new Date().getTime() + 1000 * 60 * 60
      );
      state.tokenExpirationDate = tokenExpirationDate;
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: user.id,
          token: user.token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.isLoggedIn = false;
      state.tokenExpirationDate = null;
      localStorage.removeItem("userData");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
