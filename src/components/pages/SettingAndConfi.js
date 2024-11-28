import React, { useState } from "react";
import { toast } from "sonner";
import Loader from "../Loader/Loader";
import useBusiness from "../../api/useBusiness";

const SettingAndConfi = () => {
  const { loading, changePassword } = useBusiness();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (
      !passwordData?.oldPassword ||
      !passwordData?.newPassword ||
      !passwordData?.confirmPassword
    ) {
      toast.warning("Fields should not be empty");
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      toast.warning("New password and confirm password do not match");
    } else {
      await changePassword(passwordData);
    }
  };
  return (
    <>
      <div>
        <h1 className="font-semibold text-2xl py-2">Settings</h1>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🔑</span> Change Password
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                for="old-password">
                Old Password
              </label>
              <input
                type="password"
                id="old-password"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                name="oldPassword"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                for="new-password">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                for="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400">
              Update Password
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingAndConfi;
