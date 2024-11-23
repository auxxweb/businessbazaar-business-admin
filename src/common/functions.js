/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from 'react-toastify'


const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const baseUrl = process.env.REACT_APP_BE_API_KEY ?? ""; // Use process.env


// const baseUrl = "https://server.instant-connect.in";


export const fetchPlans = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/v1/plans`, config); // Use backticks for template literals

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
    if (data.success) {
      return data;
    } else {
      console.error("Failed to fetch categories");
    }
  } catch (error) {
    console.error("Error fetching categories:", error.message);
  }
};

export const checkPaymentStatus = async (paymentId, token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/payment/status/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token here
        },
      }); // Use backticks for template literals
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = response.data;
      if (data.success) {
        return data;
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  export const CreateBusinessDetails = async (formData) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/business/`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
      if (data.success) {
        return data; // Successfully created business details
      } else {
        console.error(
          "Failed to create business details:",
          data.message || "Unknown error"
        );
        throw new Error(data.message || "Failed to create business details");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
        "Failed to create business Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            backgroundColor: "#e74c3c", // Custom red color for error
            color: "#FFFFFF", // White text
          },
        }
      );
      console.error(
        "Error occurred while fetching business site details:",
        error.message
      );
      throw error; // Propagate the error
    }
  };