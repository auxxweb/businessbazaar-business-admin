import { toast } from "sonner";
import { getApi, patchApi } from "./api";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export const useSEO = () => {
  const navigate = useNavigate();
  const [seoDetails, setSeoDetails] = useState(null); // State to hold SEO data
  const [loading, setLoading] = useState(false);

  // Function to update SEO details
  const updateSeoDetails = async (data) => {
    try {
       
      const response = await patchApi(`api/v1/business`, data, true);
      console.log("SEO Details Updated:", response.data);
      setSeoDetails(response.data); // Update state with new data
      return response.data;
    } catch (error) {
      console.error("Error updating SEO details:", error);
      throw error;
    }
  };

  // Function to get SEO details
  const getSeoDetails = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/business/profile`, true);
      console.log("Fetched SEO Details:", response?.data);
      setSeoDetails(response?.data); // Save fetched data to state
      return response?.data;
    } catch (errorMessage) {
      toast.error(errorMessage ?? "Your account has been blocked", {
        theme: "colored",
        position: "top-right",
        style: {
          backgroundColor: "red",
          color: "#FFFFFF",
          height: "60px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      });
      console.error("Error fetching SEO details:", errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
}, []);

  return {
    seoDetails, // Provide the current SEO details
    updateSeoDetails,
    getSeoDetails,
    loading, // Provide loading state if needed elsewhere
  };
};
