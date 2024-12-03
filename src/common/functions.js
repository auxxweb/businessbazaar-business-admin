/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from 'react-toastify'


const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const baseUrl = process.env.REACT_APP_BE_API_KEY ?? ""; // Use process.env
// const baseUrl = "http://localhost:5000" ?? ""; // Use process.env



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
      console.error("Failed to fetch plans");
    }
  } catch (error) {
    console.error("Error fetching plans:", error.message);
  }
};



export const createPayment = async (paymentData, token) => {
  try {
    
    const response = await axios.post(
      `${baseUrl}/api/v1/payment`,
      paymentData, 
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header
        },
      }
    );
 console.log(response.data,'llllllllllllllllllll');
    const data = response.data;
    
    if (data.success) {
      return data; // Successfully created business details
    } else {
      console.error("Failed to add payment:", data.message || "Unknown error");
      throw new Error(data.message || "Failed to add payment");
    }
    } catch (error) {
    console.error("Error creating payment:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};




export const checkPaymentStatus = async ( token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/payment/status/`, {
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

