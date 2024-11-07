import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteApi, getApi, postApi, patchApi } from "../api/api";
import { toast } from "sonner";

const useTermsAndConditions = () => {
  const { _id } = useSelector((state) => state.business.data);

  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTermsAndConditions = async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/terms_and_conditions`, true);
      setTermsAndConditions(response?.data);
    } catch (e) {
      // toast.error(e?.response?.data?.message ?? "", {
      //   position: "top-right", // Align to top-right
      //   style: {
      //     backgroundColor: "#ff4d4d", // Red color background
      //     color: "#FFFFFF", // White text color
      //     fontSize: "16px", // Adjust font size if needed
      //     borderRadius: "8px", // Optional: rounded corners for a smoother appearance
      //     padding: "10px", // Optional: Adjust padding for better spacing
      //   },
      //   duration: 3000, // Optional: Duration for the toast to stay on screen
      //   dismissible: true, // Allow the toast to be dismissed
      // });

      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const createTermsAndConditions = async (data) => {
    setLoading(true);
    try {
      const createdData = await postApi("api/v1/terms_and_conditions", data);
      setTermsAndConditions(createdData?.data);
      await fetchTermsAndConditions();
      toast.success("Terms & conditions added successfully", {
        position: "top-right", // Align to top-right
        style: {
          backgroundColor: "#0aef06", // Red color background
          color: "#FFFFFF", // White text color
          fontSize: "16px", // Adjust font size if needed
          borderRadius: "8px", // Optional: rounded corners for a smoother appearance
          padding: "10px" // Optional: Adjust padding for better spacing
        },
        duration: 3000, // Optional: Duration for the toast to stay on screen
        dismissible: true // Allow the toast to be dismissed
      });
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };
  const updateTermsAndConditions = async (data) => {
    setLoading(true);
    try {
      const updatedData = await patchApi(`api/v1/terms_and_conditions`, data);
      setTermsAndConditions(updatedData?.data);
      await fetchTermsAndConditions();
      toast.success("Terms & conditions updated successfully", {
        position: "top-right",
        style: {
          backgroundColor: "#0aef06",
          color: "#FFFFFF",
          fontSize: "16px",
          borderRadius: "8px",
          padding: "10px"
        },
        duration: 3000,
        dismissible: true
      });
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTermsAndConditions = async (id) => {
    try {
      await deleteApi(`api/v1/terms_and_conditions/${id}`, true);
      await fetchTermsAndConditions();
    } catch (e) {
      console.log(e, "error");
    }
  };

  useEffect(() => {
    if (_id) {
      fetchTermsAndConditions();
    }
  }, [_id]);

  return {
    termsAndConditions,
    loading,
    createTermsAndConditions,
    deleteTermsAndConditions,
    updateTermsAndConditions
  };
};

export default useTermsAndConditions;
