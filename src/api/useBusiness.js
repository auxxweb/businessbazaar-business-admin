import { toast } from "sonner";
import { getApi, patchApi } from "./api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getBusiness = async () => {
    setLoading(true);
    try {
      const response = await getApi(
        `api/v1/business/profile`,
        true,
        dispatch,
        navigate
      );
      setBusinesses(response?.data);
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ?? "Something went wrong ,try again!!"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (updateData) => {
    setLoading(true);
    try {
      const response = await patchApi(
        `api/v1/business`,
        { ...updateData },
        true,
        dispatch,
        navigate
      );
      if (response?.data) {
        await getBusiness();
        toast.success("Landing Page Updated successfully", {
          theme: "colored",
          position: "top-right", // Position the toast at the top-center of the screen
          style: {
            backgroundColor: "green", // Custom green background color for success
            color: "#FFFFFF", // White text
            height: "60px", // Set a higher height for the toast
            fontSize: "14px", // Increase font size for better readability
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }
        });
        
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ?? "Something went wrong ,try again!!"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getBusiness,
    loading,
    businesses,
    updateBusiness
  };
};
export default useBusiness;
