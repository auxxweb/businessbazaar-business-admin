import { toast } from "sonner";
import { getApi, patchApi, postApi } from "./api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useBusiness = () => {
  const [businesses, setBusinesses] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const logout = async () => {
    setBusinesses(null);
    localStorage.removeItem("userCredential");
    navigate("/login");
  };

  const getBusiness = async () => {
    setLoading(true);
    try {
      const response = await getApi(
        `api/v1/business/profile`,
        true,
        logout,
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
        logout,
        navigate
      );
      if (response?.data) {
        await getBusiness();
        toast.success("Business Updated successfully", {
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
            textAlign: "center"
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

  const businessLogin = async (businessData) => {
    setLoading(true);
    try {
      const response = await postApi(
        `api/v1/business/login`,
        { ...businessData },
        false,
        logout,
        navigate
      );
      if (response?.data) {
        setBusinesses(response?.data);
        localStorage.setItem(
          "userCredential",
          JSON.stringify(response?.data?.token)
        );
        toast.success("Logged in  successfully", {
          theme: "colored",
          position: "top-right",
          style: {
            backgroundColor: "green",
            color: "#FFFFFF",
            height: "60px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }
        });
        navigate("/");
        return response?.data;
      }
    } catch (error) {
      console.log(error, "errorrororororo");

      setLoading(false);
      toast.error(
        error?.response?.data?.message ?? "Something went wrong ,try again!!"
      );
    } finally {
      setLoading(false);
    }
  };

  const getBusinessDashboardData = async () => {
    setLoading(false);
    try {
      const response = await getApi(`api/v1/business/dashboard`);
      return response?.data;
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message ?? "Something went wrong!", {
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
          textAlign: "center"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData) => {
    setLoading(false);
    try {
      const response = await postApi(
        `api/v1/business/product`,
        { ...formData },
        true,
        logout,
        navigate
      );
      await getBusiness();
      return response?.data;
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message ?? "Something went wrong!", {
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
          textAlign: "center"
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      await patchApi("api/v1/business/password", passwordData, true, logout); // Replace "admin/change-password" with your actual endpoint
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await postApi(
        `api/v1/business/forgot-password`,
        { email },
        false,
        logout,
        navigate
      );
      if (response?.data){
        toast.success("Email send successfully", {
          theme: "colored",
          position: "top-right",
          style: {
            backgroundColor: "green",
            color: "#07eb38",
            height: "60px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }
        });
        // navigate("/")
      }
    } catch (error) {
      toast.error("Failed to send mail");
      console.error("Error sending mail:", error);
    } finally {
      setLoading(false);
    }
  };
  const resetpassword = async (body) => {
    setLoading(true);
    try {
      const response = await postApi(
        `api/v1/business/reset-password`,
        { ...body },
        false,
        logout,
        navigate
      );
      if (response?.data){
        toast.success("Password reset successfully", {
          theme: "colored",
          position: "top-right",
          style: {
            backgroundColor: "green",
            color: "#07eb38",
            height: "60px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }
        });
        navigate("/")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ??" password reset failed", {
        theme: "colored",
        position: "top-right",
        style: {
          backgroundColor: "red",
          color: "#ffffff",
          height: "60px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }
      });
      console.error("Error sending mail:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getBusiness,
    loading,
    businesses,
    updateBusiness,
    businessLogin,
    logout,
    getBusinessDashboardData,
    addProduct,
    changePassword,
    forgotPassword,
    resetpassword
  };
};
export default useBusiness;
