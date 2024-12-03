import { useEffect, useState } from "react";
import { getApi } from "../api/api";
import useBusiness from "../api/useBusiness";

const usePlan = () => {

  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(false);

  const {logout}=useBusiness()

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await getApi(`api/v1/payment/current-plan`,
        true,
        logout,
        );
        setPlan(response?.data);
        setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  };


  return { plan, loading ,fetchPlanDetails };
};

export default usePlan;
