import axios from "axios";
import { clearBusinessData } from "./slices/business";
import { toast } from "sonner";

const API_BASE_URL = process.env.REACT_APP_BE_API_KEY;

export const postApi = async (
  url,
  body,
  authToken = true,
  logout,
  navigate
) => {
  const token = JSON.parse(localStorage.getItem("userCredential"));
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (authToken) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/${url}`, body, config);

    return response?.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized: Please check your authentication.");
        window.localStorage.removeItem("userCredential");
        await logout();
      } else {
        toast.error(error?.response?.data?.message ?? "Login failed!", {
          position: "top-right",
          duration: 2000,
          style: {
            backgroundColor: "#ff0606", // Custom yellow color for warning
            color: "#FFFFFF" // Text color
          },
          dismissible: true
        });
        console.log("Error:----", error.response);
      }
    } else {
      console.log("Error:", error.message);
    }
  }
};

export const deleteApi = async (url, authToken = true, logout, navigate) => {
  const token = JSON.parse(localStorage.getItem("userCredential"));
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (authToken) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  }
  try {
    const response = await axios.delete(`${API_BASE_URL}/${url}`, config);
    console.log(response, "response");

    return response?.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized: Please check your authentication.");
        window.localStorage.removeItem("userCredential");
        await logout();
      } else {
        console.log("Error:", error.response.status);
      }
    } else {
      console.log("Error:", error.message);
    }
  }
};

export const getApi = async (url, authToken = true, logout, navigate) => {
  const token = localStorage.getItem("userCredential");
  const parsedToken = JSON.parse(token);

  console.log(parsedToken, "aaaaaaaaaa");

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (authToken && parsedToken) {
    config.headers.Authorization = `Bearer ${parsedToken}`;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/${url}`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized: Please check your authentication.");
        window.localStorage.removeItem("userCredential");
        await logout();
      } else {
        console.log("Error:", error.response.status);
      }
    } else {
      console.log("Error:", error.message);
    }
  }
};

// Add patchApi function
export const patchApi = async (
  url,
  body,
  authToken = true,
  logout,
  navigate
) => {
  const token = JSON.parse(localStorage.getItem("userCredential"));
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (authToken) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  }
  try {
    const response = await axios.patch(`${API_BASE_URL}/${url}`, body, config);

    return response?.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized: Please check your authentication.");
        window.localStorage.removeItem("userCredential");
        await logout();
      } else {
        console.log("Error:", error.response.status);
      }
    } else {
      console.log("Error:", error.message);
    }
  }
};
