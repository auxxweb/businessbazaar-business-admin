import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApi } from "../api/api";

const usePlan = () => {
  const { selectedPlan } = useSelector((state) => state.business.data);

  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/plans/${selectedPlan}`, false);
      setPlan(response?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlan) {
      fetchPlanDetails();
    }
  }, [selectedPlan]);

  return { plan, loading };
};

export default usePlan;
