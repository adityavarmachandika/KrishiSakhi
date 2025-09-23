import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Add JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Handle token expiry (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Session expired. Please log in again.");

      // Clear token and user data
      localStorage.removeItem("token");

      // Dispatch a custom event that UserContext can listen to
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else if (status === 403) {
      toast.error("Access denied. You don't have permission for this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default API;