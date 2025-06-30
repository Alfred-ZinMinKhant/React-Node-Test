import axios from "axios";
import { constant } from "../constant";

// Helper function to get the token
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Function to handle API requests
const handleApiRequest = async (method, path, data = null, id = null) => {
  const url = id
    ? `${constant.baseUrl}${path}${id}`
    : `${constant.baseUrl}${path}`;
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  try {
    const response = await axios({ method, url, data, headers });
    // Check for a new token in the response
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data; // Return only the data
  } catch (error) {
    console.error("API Error:", error);
    throw error; // Throw the error for handling in the calling function
  }
};

export const postApi = async (path, data, login) => {
  const result = await handleApiRequest("post", path, data);
  if (login) {
    localStorage.setItem("token", result.token);
  } else {
    sessionStorage.setItem("token", result.token);
  }
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  } else {
    console.warn("User  data is undefined in the API response.");
  }
  return result;
};

export const putApi = async (path, data, id) => {
  return await handleApiRequest("put", path, data, id);
};

export const deleteApi = async (path, param) => {
  return await handleApiRequest("delete", path, null, param);
};

export const deleteManyApi = async (path, data) => {
  return await handleApiRequest("post", path, data);
};

export const getApi = async (path, id) => {
  return await handleApiRequest("get", path, null, id);
};
