import React, { useEffect } from "react";
import usePlan from "../Hooks/usePlan";
import BackdropLoader from "./reUsableCmponent/BackdropLoader";
import { formatDate, isDateLessThanToday } from "../utils/appUtils";
import { Razorpay } from "./Razorpay/Razorpay";
import useBusiness from "../api/useBusiness";
import FullPageLoader from '../../src/components/FullPageLoader/FullPageLoader';

const Subscription = () => {
  const { plan, loading, fetchPlanDetails } = usePlan();
  const { businesses, getBusiness } = useBusiness();

  useEffect(() => {
    const fetchPlan = async () => {
      await fetchPlanDetails();
      await getBusiness();
    };
    fetchPlan();
  }, []);

  console.log(businesses, "businessed");

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
       {(loading) && <FullPageLoader />}

      <div className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subscription</h1>
        {/* <button className="bg-green-600 px-4 text-white py-1 rounded-full">+ Auto Renewal</button> */}
      </div>

      {!businesses?.isFree  ? (
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
              <p className="text-gray-700 ml-2">
                {formatDate(plan?.expiryDate)}
              </p>
            </div>
            <div className="items-center">
              <p className="text-gray-700">Amount</p>
              <p className="text-gray-700 ml-2">₹ {plan?.amount}</p>
            </div>
            <button
              // onSubmit={handlePaymentStart}
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
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
  {/* Centered Free Trial Message */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px', // Adjust height to fit your card size
      color: '#4CAF50', // Text color
      fontSize: '18px', // Font size for the message
      textAlign: 'center',
      fontWeight: 'bold',
    }}
  >
  You are now in Free plan
  </div>
</div>

      )}
    </>
  );
};

export default Subscription;
