import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // user con fullName e id
  token: null // token dell'utente
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Imposto i dati dell'utente
      /* console.log("setUser payload ricevuto:", action.payload); */
      state.user = action.payload;
    },
    setToken: (state, action) => {
      /*  console.log("setToken payload ricevuto:", action.payload); */
      // Imposto il token
      state.token = action.payload;
    },
    logout: (state) => {
      // Reset dell'utente e del token al logout
      state.user = null;
      state.token = null;
    }
  }
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
