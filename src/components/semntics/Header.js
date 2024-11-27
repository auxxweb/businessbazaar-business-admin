import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { LiaEdit } from "react-icons/lia";

import avatar from "../../assets/images/avatar.png";
import { PiSignOut } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Modal from "../reUsableCmponent/modal/Modal";
import { useUpdatePasswordMutation } from "../../api/auth";
import { toast } from "sonner";
import useBusiness from "../../api/useBusiness";

function Header({ toggleSidebar }) {
  const { logout, businesses, getBusiness } = useBusiness();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatePassword, { isLoading: isLoadingUpdatePassword }] =
    useUpdatePasswordMutation();
  const navigate = useNavigate();
  const handleSignout = async () => {
    window.localStorage.removeItem("userCredential");
    await logout();
    navigate("/login");
  };

  const handleChangePasswordClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      getBusiness();
    };

    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target);
    const oldPassword = formData.get("oldPassword");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match", {
        position: "top-right",
        duration: 2000,
        style: {
          backgroundColor: "#fb0909", // Custom green color for success
          color: "#FFFFFF" // Text color
        }
      });
      return;
    }
    try {
      const body = {
        oldPassword,
        password
      };
      const updateres = await updatePassword?.(body);
      if (updateres?.data?.success) {
        toast.success("Password changed successfully", {
          position: "top-right",
          duration: 2000,
          style: {
            backgroundColor: "#4CAF50", // Custom green color for success
            color: "#FFFFFF" // Text color
          },
          dismissible: true
        });
        handleModalClose();
      } else {
        // toast.error(updateres?.data?.message,{
        //   position: "top-right",
        //   style: {
        //     backgroundColor: "#fb0909", // Custom green color for success
        //     color: "#FFFFFF", // Text color
        //   },
        // })
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <header
      className="flex items-center justify-between p-3"
      style={{ background: "linear-gradient(135deg, #105193, #107D93)" }}>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossOrigin="anonymous"
      />
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
        crossOrigin="anonymous"></script>
      <button
        className="text-gray-200 focus:outline-none lg:hidden"
        onClick={toggleSidebar}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <img
        src="../logo.jpeg"
        alt="Description of Image"
        width="65"
        height="53"
      />

      <div className="flex items-center space-x-2">
        <img
          src={businesses?.logo ?? avatar}
          className="h-9 w-9 object-contain"
          style={{
            borderRadius: "50%", // Makes the image circular
            border: "2px solid #0ab5be", // Adds a colored border around the image
            padding: "2px", // Adds padding to separate the border from the image
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow for a raised effect
            objectFit: "cover" // Ensures the image covers the circular area fully
          }}
        />

        <span className="text-white">{businesses?.businessName}</span>
        <div className=" group cursor-pointer relative">
          <div>
            <HiDotsVertical className="text-white h-5 w-5" />
          </div>
          <div className="hidden cursor-default w-max max-w-xs group-hover:block absolute right-1 ">
            <div className="p-2  space-y-3  bg-white  rounded-md border border-slate-100 mt-2 shadow-lg  dark:border-slate-50/10 dark:bg-gray-800 dark:text-slate-200">
              <div
                onClick={handleSignout}
                className="p-1 sm:p-2 cursor-pointer hover:bg-slate-100 flex space-x-1 items-center dark:hover:bg-slate-400/25">
                <PiSignOut className="text-black h-5 w-5 dark:text-white" />{" "}
                <span>Signout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        modalHeader={"Update Password"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700">
                Old password
              </label>
              <input
                type="text"
                name="oldPassword"
                id="oldPassword"
                className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                type="text"
                name="password"
                id="password"
                className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                type="text"
                name="confirmPassword"
                id="confirmPassword"
                className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-center p-6">
            <button
              disabled={isLoadingUpdatePassword}
              type="submit"
              className="bg-[#105193] hover:bg-[#107D93] text-white font-bold py-2 px-6 rounded-3xl">
              {isLoadingUpdatePassword ? "loading..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
}

export default Header;
