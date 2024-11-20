import React, { useEffect } from "react";
import usePlan from "../Hooks/usePlan";
import BackdropLoader from "./reUsableCmponent/BackdropLoader";
import { formatDate, isDateLessThanToday } from "../utils/appUtils";
import useBusiness from "../api/useBusiness";

const Subscription = () => {
  const { plan, loading, fetchPlanDetails } = usePlan();
  const { businesses, getBusiness } = useBusiness();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPlanDetails(), getBusiness()]);
    };
    fetchData();
  }, []);

  if (loading) {
    return <BackdropLoader isLoading={loading} />;
  }

  const renderFreePlan = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          color: "#4CAF50",
          fontSize: "18px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
        You are now in Free plan
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
        <button
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
      {!businesses?.isFree ? renderPaidPlan() : renderFreePlan()}
    </>
  );
};

export default Subscription;
