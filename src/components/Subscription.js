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

          <div className="flex items-center">
            <svg
              className="w-10 h-10 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.75A4.5 4.5 0 117.5 11.25v4.5A4.5 4.5 0 1112 15V11.25z"
              ></path>
            </svg>
            <span className="text-gray-700">Auto-renewal off</span>
          </div>

          <div className="items-center">
            <p className="text-gray-700">Expiration Date</p>
            <p className="text-gray-700 ml-2">02-05-2024</p>
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
