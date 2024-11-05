import axios, { AxiosRequestConfig } from "axios";
// import { getLocalStorageItem } from '../utils/appUtils'

const API_BASE_URL = process.env.REACT_APP_BE_API_KEY;

export const postApi = async (url, body, authToken = true) => {
  const token = JSON.parse(localStorage.getItem("userCredential"));
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (authToken) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await axios.post(`${API_BASE_URL}/${url}`, body, config);
  console.log(response, "response");

  return response?.data;
};

export const deleteApi = async (url, authToken = true) => {
    const token = JSON.parse(localStorage.getItem("userCredential"));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await axios.delete(`${API_BASE_URL}/${url}`, config);
    console.log(response, "response");
  
    return response?.data;
  };

export const getApi = async (url, authToken) => {
  const token = localStorage.getItem("userCredential");

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (authToken) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(`${API_BASE_URL}/${url}`, config);

  return response?.data;
};
