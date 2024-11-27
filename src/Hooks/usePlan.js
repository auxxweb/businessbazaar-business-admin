import { useEffect, useState } from "react";
import { getApi } from "../api/api";
import useBusiness from "../api/useBusiness";

const usePlan = () => {

  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(false);

  const {logout}=useBusiness()

  const fetchPlanDetails = async () => {
    // setLoading(true);
    // try {
    //   const response = await getApi(`api/v1/payment/current-plan`, true,logout);
    //   setPlan(response?.data);
    // } catch (e) {
    //   console.log(e, "error");
    // } finally {
    //   setLoading(false);
    // }
  };


  return { plan, loading ,fetchPlanDetails };
};

export default usePlan;
