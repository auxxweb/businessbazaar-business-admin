import React, { useEffect, useState } from "react";
import usePlan from "../Hooks/usePlan";
import { formatDate, isDateLessThanToday } from "../utils/appUtils";
import useBusiness from "../api/useBusiness";
import FullPageLoader from "./FullPageLoader/FullPageLoader";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const { plan, loading, fetchPlanDetails } = usePlan();
  const { loading: businessLoading, businesses, getBusiness } = useBusiness();
  const [planLoading, setPlanLoading] = useState(false);
  const navigate= useNavigate()


  useEffect(() => {
    if (loading || businessLoading) {
      setPlanLoading(true);
    } else {
      setPlanLoading(false);
    }
  }, [loading, businessLoading]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPlanDetails(), getBusiness()]);
    };
    fetchData();
  }, []);

  if(planLoading){
    return <FullPageLoader/>
  }


  const renderFreePlan = () => (
<div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      color: "#1D4ED8", // Tailwind [#107D93]
      fontSize: "20px", // Slightly larger font size for premium feel
      textAlign: "center",
      fontWeight: "500", // Medium font weight
      fontFamily: "'Inter', sans-serif" // Premium standard font
    }}
  >
    You are now in Free plan
  </div>
  <div class="flex justify-end">
        <button
        onClick={()=>navigate("/plans")}
        class="px-4 py-2 bg-green-800 mt-3 mr-3 text-white rounded hover:bg-blue-600">
          Renew Plan
        </button>
      </div>
</div>

  );

  const renderPaidPlan = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{plan?.plan?.plan}</h2>
      <div className="flex space-x-4 justify-between items-center">
        <div className="items-center">
          <p className="text-gray-700">{plan?.plan?.validity} year</p>
          <p className="text-gray-700 mt-2">ID: {plan?.paymentId}</p>
        </div>
        <div className="items-center">
          <p className="text-gray-700">Started Date</p>
          <p className="text-gray-700 ml-2">{formatDate(plan?.date)}</p>
        </div>
        <div className="items-center">
          <p className="text-gray-700">Expiration Date</p>
          <p className="text-gray-700 ml-2">{formatDate(plan?.expiryDate)}</p>
        </div>
        <div className="items-center">
          <p className="text-gray-700">Amount</p>
          <p className="text-gray-700 ml-2">₹ {plan?.amount}</p>
        </div>
        <button onClick={() => navigate("/plans")}
          disabled={!isDateLessThanToday(plan?.expiryDate)}
          className={`border-2 px-4 py-2 rounded-lg ${
            !isDateLessThanToday(plan?.expiryDate)
              ? `text-green-600 border-green-600`
              : `text-red-600 border-red-600`
          }`}>
          {!isDateLessThanToday(plan?.expiryDate) ? "Active" : "Renew now"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subscription</h1>
      </div>
      {
        (businesses?.isFree || businesses?.isInFreeTrail) && !planLoading
        ? renderFreePlan()
        : renderPaidPlan()
        // ? renderPaidPlan()
        // : renderFreePlan()
      }
     
    </>
  );
};

export default Subscription;
