import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { store } from "../redux/store";
import { clearUser } from "../redux/slices/localSlice";

export const checkTokenValidity = (token) => {
  try {
    if (!token) return false;

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const handleLogout = (navigate) => {
  // Clear storage
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear Redux state
  store.dispatch(clearUser());

  // Notify user
  toast.info("Logged out successfully");

  // Navigate to login
  if (navigate) navigate("/login");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
