import React, { useEffect } from "react";
import usePlan from "../Hooks/usePlan";
import BackdropLoader from "./reUsableCmponent/BackdropLoader";
import { formatDate, isDateLessThanToday } from "../utils/appUtils";
import { Razorpay } from "./Razorpay/Razorpay";

const Subscription = () => {
  const { plan, loading, fetchPlanDetails } = usePlan();

  useEffect(() => {
    const fetchPlan = async () => {
      await fetchPlanDetails();
    };
    fetchPlan();
  }, []);

  // const handlePaymentResponse = async (responseData) => {
  //   var paymentDetails = {
  //     plan: paymentData?.selectedPlan,
  //     paymentId: response?.razorpay_payment_id,
  //     date: new Date()
  //   };
  //   const response = await createPayment(paymentDetails)
  // };

  // const handlePaymentStart = async (e) => {
  //   e.preventDefault();
  //   return <Razorpay handlePaymentResponse={handlePaymentResponse} />;
  // };
  return (
    <>
      <BackdropLoader isLoading={loading} />
      <div className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subscription</h1>
        {/* <button className="bg-green-600 px-4 text-white py-1 rounded-full">+ Auto Renewal</button> */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md ">
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
            // onSubmit={handlePaymentStart}
            disabled={isDateLessThanToday(plan?.expiryDate)}
            className={`border-2 px-4 py-2 rounded-lg ${
              isDateLessThanToday(plan?.expiryDate)
                ? `text-green-600 border-green-600`
                : `text-red-600 border-red-600`
            }`}>
            {isDateLessThanToday(plan?.expiryDate) ? "Active" : "Renew now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Subscription;
