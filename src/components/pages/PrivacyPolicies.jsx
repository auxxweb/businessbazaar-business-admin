import React, { useState } from "react";
import usePrivacyPolicies from "../../Hooks/usePrivacyPolicies";
import BackdropLoader from "../reUsableCmponent/BackdropLoader";

const PrivacyPolicies = () => {
  const {
    privacyPolicies,
    loading,
    deletePrivacyPolicy,
    createPrivacyPolicies,
  } = usePrivacyPolicies();

  const [title, setTitle] = useState("");
  const [data, setData] = useState("");

  const handleAddTerm = () => {
    if (title && data) {
      createPrivacyPolicies({ privacyPolicies: [{ title, data }] });
      setTitle("");
      setData("");
    }
  };

  const handleDeletePolicy = async (id) => {
    await deletePrivacyPolicy(id);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Privacy Policies</h1>

      {/* Form Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Privacy Policy</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Data"
            className="border p-2 rounded"
            value={data}
            onChange={(e) => setData(e.target.value)}
          ></textarea>
          <button
              className="mt-6 bg-[#105193] text-white py-2 px-4 rounded-lg hover:bg-[#107D93] transition "
            onClick={handleAddTerm}
          >
            Add Policy
          </button>
        </div>
      </div>

      {/* Listing Section */}
      <h2 className="text-lg font-semibold mb-4">Privacy Policies List</h2>

      <BackdropLoader isLoading={loading} />
      <div className="space-y-4">
        {privacyPolicies.map((policy) => (
          <div
            key={policy.id}
            className="p-4 border rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-bold">{policy.title}</h3>
              <p>{policy.data}</p>
            </div>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeletePolicy(policy._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicies;
