import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postApi } from "./api";
import useBusiness from "./useBusiness";

const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const { logout } = useBusiness();

  const navigate = useNavigate();

  const createPayment = async (paymentData) => {
    setLoading(true);
    try {
      const response = await postApi(``, paymentData, true, logout);

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

  return {
    createPayment
  };
};

export default usePayment;
