import React from "react";
import usePlan from "../Hooks/usePlan";
import BackdropLoader from "./reUsableCmponent/BackdropLoader";

const Subscription = () => {
  const { plan, loading } = usePlan();

  console.log(plan, "plan details");
  return (
    <>
      <BackdropLoader isLoading={loading} />
      <div className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subscription</h1>
        {/* <button className="bg-green-600 px-4 text-white py-1 rounded-full">+ Auto Renewal</button> */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md ">
        <h2 className="text-xl font-semibold">{plan?.plan}</h2>

        <div className="flex space-x-4 justify-between items-center">
          <div className="items-center">
            <p className="text-gray-700">{plan?.validity} year</p>
            <p className="text-gray-700 mt-2">ID: {plan?._id}</p>
          </div>

          <div className="items-center">
            <p className="text-gray-700">Started Date</p>
            <p className="text-gray-700 ml-2">02-05-2023</p>
          </div>

          <div className="items-center">
            <p className="text-gray-700">Expiration Date</p>
            <p className="text-gray-700 ml-2">01-05-2024</p>
          </div>
          <div className="items-center">
            <p className="text-gray-700">Renewal Price</p>
            <p className="text-gray-700 ml-2">₹ {plan?.amount}</p>
          </div>
          <button className="text-green-600 border-2 border-green-600 px-4 py-2 rounded-lg">
            Renew now
          </button>
        </div>
      </div>
    </>
  );
};

export default Subscription;
