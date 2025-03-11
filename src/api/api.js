import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/reducers/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080" // URL del tuo backend
});

// Interceptor per aggiungere il token alle richieste
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor per gestire token scaduto
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se il token è scaduto, fa il logout
      store.dispatch(logout());
      localStorage.removeItem("token");
      window.location.href = "/"; // Reindirizza al login
    }
    return Promise.reject(error);
  }
);

export default api;
