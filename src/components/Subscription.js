import React, { useEffect, useState } from "react";
import usePlan from "../Hooks/usePlan";
import { formatDate, isDateLessThanToday } from "../utils/appUtils";
import FullPageLoader from "./FullPageLoader/FullPageLoader";
import { useNavigate } from "react-router-dom";


const Subscription = () => {
  const { plan, loading, fetchPlanDetails } = usePlan();
  const navigate = useNavigate()
  const [currentPlan, setCurrentPlan] = useState({
    startDate: null,
    endDate: null,
    amount: 0,
    planStatus: false,
    specialAccess: false
  })
  const [planIsActive, setPlanIsActive] = useState(false)

  useEffect(() => {
    fetchPlanDetails()
  }, []);

  useEffect(() => {

    if (plan) {
      const { business, payment } = plan;

      console.log({business,payment});
      

      if (business?.plan === "SPECIAL_TRAIL") {
        setPlanIsActive(true)
        setCurrentPlan((prev) => ({ ...prev, startDate: business?.validity, specialAccess: true }))
      } else {

        if(payment){
          if (isDateLessThanToday(payment?.expiryDate) || isDateLessThanToday(business?.validity)) {
            setPlanIsActive(false)
            setCurrentPlan(((prev) => ({
              ...prev,
              startDate: payment?.createdAt,
              endDate: payment?.expiryDate,
              amount: payment?.amount
            })))
          }

          if(!isDateLessThanToday(payment?.expiryDate)){
            setPlanIsActive(true)
          setCurrentPlan(((prev) => ({
            ...prev,
            startDate: payment?.createdAt,
            endDate: payment?.expiryDate,
            amount: payment?.amount
          })))
          }

        }else{
          if(business?.plan === "FREE_TRAIL" && !isDateLessThanToday(business?.validity)){
            setPlanIsActive(true)
            setCurrentPlan(((prev) => ({
              ...prev,
              startDate: business?.createdAt ?business?.createdAt : business?.selectedPlan?.createdAt,
              endDate: business?.validity,
              amount: 0
            })))
          }
          if(business?.plan ==='PAID' &&  !isDateLessThanToday(business?.validity)){
            setPlanIsActive(true)
            setCurrentPlan(((prev) => ({
              ...prev,
              startDate: business?.createdAt,
              endDate: business?.validity,
              amount: 0
            })))
          }
        }
      }
    }


  }, [plan]);

  if (loading) {
    return <FullPageLoader />
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
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/plans")}
          className="px-4 py-2 bg-green-800 mt-3 mr-3 text-white rounded hover:bg-blue-600">
          Renew Plan
        </button>
      </div>
    </div>

  );

  const renderPaidPlan = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{plan?.payment?.plan?.plan}</h2>
      <div className="flex flex-col sm:flex-row space-x-4 justify-between items-center">
        <div className="items-center">
          <p className="text-gray-700">{plan?.business?.plan === "SPECIAL_TRAIL" ? "Special Trail" : plan?.payment?.plan?.validity} year</p>
          {/* <p className="text-gray-700 mt-2">ID: {plan?.payment?._id}</p> */}
        </div>
        <div className="items-center">
          <p className="text-gray-700 font-semibold">Started Date</p>
          <p className="text-gray-700 ml-2">{`${currentPlan?.startDate ? formatDate(currentPlan?.startDate)  : " "}`}</p>
        </div>
        <div className="items-center">
          <p className="text-gray-700 font-semibold">Expiration Date</p>
          <p className="text-gray-700 ml-2">{`${currentPlan?.endDate ? formatDate(currentPlan?.endDate)  : ""}`}</p>
        </div>
        <div className="items-center">
          <p className="text-gray-700 font-semibold">Amount</p>
          <p className="text-gray-700 ml-2">₹ {currentPlan?.amount}</p>
        </div>
        <button onClick={() => navigate("/plans")}
          disabled={planIsActive}
          className={`border-2 px-4 py-2 rounded-lg ${planIsActive
            ? `text-green-600 border-green-600`
            : `text-red-600 border-red-600`
            }`}>
          {!isDateLessThanToday(currentPlan?.endDate) ? "Active" : "Renew now"}
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
        (plan?.business?.isFree || plan?.business?.isInFreeTrail)
          ? renderPaidPlan()
          : renderFreePlan()
      }

    </>
  );
};

export default Subscription;
