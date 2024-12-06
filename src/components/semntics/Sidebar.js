
import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Modal from "../reUsableCmponent/modal/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useBusiness from "../../api/useBusiness";

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { loading, logout } = useBusiness();
  // navigate('/browse');
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-300 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
      className="bg-[#212529] w-[268px] h-full overflow-y-scroll space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 z-50">
      {/* Sidebar content */}
      <div>
        {/* Close button for mobile */}
        <button
          className="lg:hidden text-white focus:outline-none absolute right-4 top-4"
          onClick={() => setIsOpen(false)}>
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Links */}
        <div
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === ""
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}
          onClick={() => navigate("/")}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="24"
              viewBox="0 0 20 24"
              fill={
                location?.pathname?.split("/")[1] === ""
                  ? "#98b3ce"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3H10C10.55 3 11 3.45 11 4V10C11 10.55 10.55 11 10 11H3C2.45 11 2 10.55 2 10V4C2 3.45 2.45 3 3 3ZM3 13H8C8.55 13 9 13.45 9 14V20C9 20.55 8.55 21 8 21H3C2.45 21 2 20.55 2 20V14C2 13.45 2.45 13 3 13ZM13 3H21C21.55 3 22 3.45 22 4V8C22 8.55 21.55 9 21 9H13C12.45 9 12 8.55 12 8V4C12 3.45 12.45 3 13 3ZM13 11H21C21.55 11 22 11.45 22 12V20C22 20.55 21.55 21 21 21H13C12.45 21 12 20.55 12 20V12C12 11.45 12.45 11 13 11Z"
                fill={
                  location?.pathname?.split("/")[1] === ""
                    ? "#98b3ce"
                    : "currentColor"
                }
              />
            </svg>
            <span className="text-custom-16 hover:text-[#d4e0ec] ml-4">
              Dashboard
            </span>
          </span>
        </div>
        <div
          onClick={() => navigate("/zones")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "zones"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2 ">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={
                location?.pathname?.split("/")[1] === "zones"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C13.105 2 14 2.895 14 4C14 5.105 13.105 6 12 6C10.895 6 10 5.105 10 4C10 2.895 10.895 2 12 2ZM8 9C9.105 9 10 9.895 10 11C10 12.105 9.105 13 8 13C6.895 13 6 12.105 6 11C6 9.895 6.895 9 8 9ZM16 9C17.105 9 18 9.895 18 11C18 12.105 17.105 13 16 13C14.895 13 14 12.105 14 11C14 9.895 14.895 9 16 9ZM12 15C13.105 15 14 15.895 14 17C14 18.105 13.105 19 12 19C10.895 19 10 18.105 10 17C10 15.895 10.895 15 12 15ZM12 7C13.33 7 14.54 7.47 15.46 8.27L17.54 7.15C18.09 6.85 18.77 7.23 18.92 7.83C19.07 8.44 18.69 9.12 18.09 9.27L16 10.2V11.8L18.09 12.73C18.69 12.88 19.07 13.56 18.92 14.17C18.77 14.77 18.09 15.15 17.54 14.85L15.46 13.73C14.54 14.53 13.33 15 12 15C10.67 15 9.46 14.53 8.54 13.73L6.46 14.85C5.91 15.15 5.23 14.77 5.08 14.17C4.93 13.56 5.31 12.88 5.91 12.73L8 11.8V10.2L5.91 9.27C5.31 9.12 4.93 8.44 5.08 7.83C5.23 7.23 5.91 6.85 6.46 7.15L8.54 8.27C9.46 7.47 10.67 7 12 7Z"
                fill={
                  location?.pathname?.split("/")[1] === "zones"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>
            <span className={`text-custom-16 ml-4`}>Leads</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/blogs")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "blogs"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2 ">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={
                location?.pathname?.split("/")[1] === "blogs"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 3H20C20.55 3 21 3.45 21 4V17C21 18.65 19.65 20 18 20H6C4.35 20 3 18.65 3 17V4C3 3.45 3.45 3 4 3ZM19 5H5V17C5 17.55 5.45 18 6 18H18C18.55 18 19 17.55 19 17V5ZM7 7H13C13.55 7 14 7.45 14 8C14 8.55 13.55 9 13 9H7C6.45 9 6 8.55 6 8C6 7.45 6.45 7 7 7ZM7 11H17C17.55 11 18 11.45 18 12C18 12.55 17.55 13 17 13H7C6.45 13 6 12.55 6 12C6 11.45 6.45 11 7 11ZM7 15H17C17.55 15 18 15.45 18 16C18 16.55 17.55 17 17 17H7C6.45 17 6 16.55 6 16C6 15.45 6.45 15 7 15Z"
                fill={
                  location?.pathname?.split("/")[1] === "blogs"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>
            <span className={`text-custom-16 ml-4`}>Blogs</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/landing-page")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "landing-page"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 96 96"
              fill={
                location?.pathname?.split("/")[1] === "landing-page"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M12 12H84C85.1 12 86 12.9 86 14V82C86 83.1 85.1 84 84 84H12C10.9 84 10 83.1 10 82V14C10 12.9 10.9 12 12 12ZM16 16V32H80V16H16ZM16 40H48V52H16V40ZM52 40H80V52H52V40ZM16 60H36V72H16V60ZM40 60H80V72H40V60Z"
                fill={
                  location?.pathname?.split("/")[1] === "landing-page"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Landing Page Info</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/welcome-page")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "welcome-page"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 96 96"
              fill={
                location?.pathname?.split("/")[1] === "welcome-page"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M12 12H84C85.1 12 86 12.9 86 14V82C86 83.1 85.1 84 84 84H12C10.9 84 10 83.1 10 82V14C10 12.9 10.9 12 12 12ZM16 16V32H80V16H16ZM24 40H32V60H24V40ZM36 40H44V60H36V40ZM48 40H56V60H48V40ZM60 40H68V60H60V40ZM72 40H80V60H72V40Z"
                fill={
                  location?.pathname?.split("/")[1] === "welcome-page"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Welcome Page Info</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/products")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "products"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 64 64"
              fill={
                location?.pathname?.split("/")[1] === "products"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M16 20H80C80.5523 20 81 20.4477 81 21C81 21.5523 80.5523 22 80 22H16C15.4477 22 15 21.5523 15 21C15 20.4477 15.4477 20 16 20ZM16 36H80C80.5523 36 81 36.4477 81 37C81 37.5523 80.5523 38 80 38H16C15.4477 38 15 37.5523 15 37C15 36.4477 15.4477 36 16 36ZM16 52H80C80.5523 52 81 52.4477 81 53C81 53.5523 80.5523 54 80 54H16C15.4477 54 15 53.5523 15 53C15 52.4477 15.4477 52 16 52ZM16 68H80C80.5523 68 81 68.4477 81 69C81 69.5523 80.5523 70 80 70H16C15.4477 70 15 69.5523 15 69C15 68.4477 15.4477 68 16 68ZM16 84H80C80.5523 84 81 84.4477 81 85C81 85.5523 80.5523 86 80 86H16C15.4477 86 15 85.5523 15 85C15 84.4477 15.4477 84 16 84Z"
                fill={
                  location?.pathname?.split("/")[1] === "products"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Products</span>
          </span>
        </div>
        <div
          onClick={() => navigate("/special-services")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "special-services"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill={
                location?.pathname?.split("/")[1] === "special-services"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M8 0.75C7.04667 0.75 6.16778 0.984444 5.36333 1.45333C4.55889 1.92222 3.92222 2.55889 3.45333 3.36333C2.98444 4.16778 2.75 5.04667 2.75 6C2.75 6.89111 2.95667 7.71889 3.37 8.48333C3.78556 9.25 4.35222 9.87556 5.07 10.36C4.17889 10.7511 3.38556 11.29 2.69 11.9767C1.99667 12.6633 1.46222 13.4522 1.08667 14.3433C0.695556 15.2656 0.5 16.2344 0.5 17.25H2C2 16.1567 2.27 15.1522 2.81 14.2367C3.34778 13.3233 4.07333 12.5978 4.98667 12.06C5.90222 11.52 6.90667 11.25 8 11.25C9.09333 11.25 10.0978 11.52 11.0133 12.06C11.9267 12.5978 12.6522 13.3233 13.19 14.2367C13.73 15.1522 14 16.1567 14 17.25H15.5C15.5 16.2344 15.3044 15.2656 14.9133 14.3433C14.5378 13.4522 14.0033 12.6633 13.31 11.9767C12.6144 11.29 11.8211 10.7511 10.93 10.36C11.6478 9.87556 12.2144 9.25 12.63 8.48333C13.0433 7.71889 13.25 6.89111 13.25 6C13.25 5.04667 13.0156 4.16778 12.5467 3.36333C12.0778 2.55889 11.4411 1.92222 10.6367 1.45333C9.83222 0.984444 8.95333 0.75 8 0.75ZM8 2.25C8.68667 2.25 9.31556 2.41778 9.88667 2.75333C10.4578 3.08889 10.9111 3.54222 11.2467 4.11333C11.5822 4.68444 11.75 5.31333 11.75 6C11.75 6.68667 11.5822 7.31556 11.2467 7.88667C10.9111 8.45778 10.4578 8.91111 9.88667 9.24667C9.31556 9.58222 8.68667 9.75 8 9.75C7.31333 9.75 6.68444 9.58222 6.11333 9.24667C5.54222 8.91111 5.08889 8.45778 4.75333 7.88667C4.41778 7.31556 4.25 6.68667 4.25 6C4.25 5.31333 4.41778 4.68444 4.75333 4.11333C5.08889 3.54222 5.54222 3.08889 6.11333 2.75333C6.68444 2.41778 7.31333 2.25 8 2.25Z"
                fill={
                  location?.pathname?.split("/")[1] === "special-services"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Special Services</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/services")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "services"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 20"
              fill={
                location?.pathname?.split("/")[1] === "services"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M7.62667 0.5C7.15778 0.5 6.72 0.616667 6.31333 0.85C5.90667 1.08556 5.58556 1.40667 5.35 1.81333C5.11667 2.22 5 2.65778 5 3.12667C5 3.59333 5.11667 4.03 5.35 4.43667C5.58556 4.84333 5.90667 5.16444 6.31333 5.4C6.72 5.63333 7.15778 5.75 7.62667 5.75C8.09333 5.75 8.53 5.63333 8.93667 5.4C9.34333 5.16444 9.66444 4.84333 9.9 4.43667C10.1333 4.03 10.25 3.59333 10.25 3.12667C10.25 2.65778 10.1333 2.22 9.9 1.81333C9.66444 1.40667 9.34333 1.08556 8.93667 0.85C8.53 0.616667 8.09333 0.5 7.62667 0.5ZM14.3767 0.5C13.9078 0.5 13.47 0.616667 13.0633 0.85C12.6567 1.08556 12.3356 1.40667 12.1 1.81333C11.8667 2.22 11.75 2.65778 11.75 3.12667C11.75 3.59333 11.8667 4.03 12.1 4.43667C12.3356 4.84333 12.6567 5.16444 13.0633 5.4C13.47 5.63333 13.9078 5.75 14.3767 5.75C14.8433 5.75 15.28 5.63333 15.6867 5.4C16.0933 5.16444 16.4144 4.84333 16.65 4.43667C16.8833 4.03 17 3.59333 17 3.12667C17 2.65778 16.8833 2.22 16.65 1.81333C16.4144 1.40667 16.0933 1.08556 15.6867 0.85C15.28 0.616667 14.8433 0.5 14.3767 0.5ZM7.62667 2C7.93778 2 8.20333 2.10889 8.42333 2.32667C8.64111 2.54667 8.75 2.81333 8.75 3.12667C8.75 3.43778 8.64111 3.70333 8.42333 3.92333C8.20333 4.14111 7.93778 4.25 7.62667 4.25C7.31333 4.25 7.04667 4.14111 6.82667 3.92333C6.60889 3.70333 6.5 3.43778 6.5 3.12667C6.5 2.81333 6.60889 2.54667 6.82667 2.32667C7.04667 2.10889 7.31333 2 7.62667 2ZM14.3767 2C14.6878 2 14.9533 2.10889 15.1733 2.32667C15.3911 2.54667 15.5 2.81333 15.5 3.12667C15.5 3.43778 15.3911 3.70333 15.1733 3.92333C14.9533 4.14111 14.6878 4.25 14.3767 4.25C14.0633 4.25 13.7967 4.14111 13.5767 3.92333C13.3589 3.70333 13.25 3.43778 13.25 3.12667C13.25 2.81333 13.3589 2.54667 13.5767 2.32667C13.7967 2.10889 14.0633 2 14.3767 2ZM4.25 5C3.70333 5 3.20333 5.13667 2.75 5.41C2.29667 5.68333 1.93333 6.04667 1.66 6.5C1.38667 6.95333 1.25 7.45333 1.25 8C1.25 8.40667 1.33222 8.79333 1.49667 9.16C1.66111 9.52667 1.88333 9.85111 2.16333 10.1333C1.64778 10.4778 1.24222 10.9233 0.946667 11.47C0.648889 12.0167 0.5 12.61 0.5 13.25H2C2 12.6256 2.21889 12.0944 2.65667 11.6567C3.09444 11.2189 3.62556 11 4.25 11C4.87444 11 5.40556 11.2189 5.84333 11.6567C6.28111 12.0944 6.5 12.6256 6.5 13.25H8C8 12.61 7.85111 12.0167 7.55333 11.47C7.25778 10.9233 6.85222 10.4778 6.33667 10.1333C6.61667 9.85111 6.83889 9.52667 7.00333 9.16C7.16778 8.79333 7.25 8.40667 7.25 8C7.25 7.45333 7.11333 6.95333 6.84 6.5C6.56667 6.04667 6.20333 5.68333 5.75 5.41C5.29667 5.13667 4.79667 5 4.25 5ZM8 13.25C7.5 13.9211 7.25 14.6711 7.25 15.5H8.75C8.75 14.8756 8.96889 14.3444 9.40667 13.9067C9.84444 13.4689 10.3756 13.25 11 13.25C11.6244 13.25 12.1556 13.4689 12.5933 13.9067C13.0311 14.3444 13.25 14.8756 13.25 15.5H14.75C14.75 14.6711 14.5 13.9211 14 13.25C13.7511 12.9056 13.4467 12.6167 13.0867 12.3833C13.3667 12.1011 13.5889 11.7767 13.7533 11.41C13.9178 11.0433 14 10.6567 14 10.25C14 9.70333 13.8633 9.20333 13.59 8.75C13.3167 8.29667 12.9533 7.93333 12.5 7.66C12.0467 7.38667 11.5467 7.25 11 7.25C10.4533 7.25 9.95333 7.38667 9.5 7.66C9.04667 7.93333 8.68333 8.29667 8.41 8.75C8.13667 9.20333 8 9.70333 8 10.25C8 10.6567 8.08222 11.0433 8.24667 11.41C8.41111 11.7767 8.63333 12.1011 8.91333 12.3833C8.55556 12.6167 8.25111 12.9056 8 13.25ZM14 13.25H15.5C15.5 12.6256 15.7189 12.0944 16.1567 11.6567C16.5944 11.2189 17.1256 11 17.75 11C18.3744 11 18.9056 11.2189 19.3433 11.6567C19.7811 12.0944 20 12.6256 20 13.25H21.5C21.5 12.61 21.3511 12.0167 21.0533 11.47C20.7578 10.9233 20.3522 10.4778 19.8367 10.1333C20.1167 9.85111 20.3389 9.52667 20.5033 9.16C20.6678 8.79333 20.75 8.40667 20.75 8C20.75 7.45333 20.6133 6.95333 20.34 6.5C20.0667 6.04667 19.7033 5.68333 19.25 5.41C18.7967 5.13667 18.2967 5 17.75 5C17.2033 5 16.7033 5.13667 16.25 5.41C15.7967 5.68333 15.4333 6.04667 15.16 6.5C14.8867 6.95333 14.75 7.45333 14.75 8C14.75 8.40667 14.8322 8.79333 14.9967 9.16C15.1611 9.52667 15.3833 9.85111 15.6633 10.1333C15.1478 10.4778 14.7422 10.9233 14.4467 11.47C14.1489 12.0167 14 12.61 14 13.25ZM4.25 6.5C4.67222 6.5 5.02778 6.64444 5.31667 6.93333C5.60556 7.22222 5.75 7.57778 5.75 8C5.75 8.42222 5.60556 8.77778 5.31667 9.06667C5.02778 9.35556 4.67222 9.5 4.25 9.5C3.82778 9.5 3.47222 9.35556 3.18333 9.06667C2.89444 8.77778 2.75 8.42222 2.75 8C2.75 7.57778 2.89444 7.22222 3.18333 6.93333C3.47222 6.64444 3.82778 6.5 4.25 6.5ZM17.75 6.5C18.1722 6.5 18.5278 6.64444 18.8167 6.93333C19.1056 7.22222 19.25 7.57778 19.25 8C19.25 8.42222 19.1056 8.77778 18.8167 9.06667C18.5278 9.35556 18.1722 9.5 17.75 9.5C17.3278 9.5 16.9722 9.35556 16.6833 9.06667C16.3944 8.77778 16.25 8.42222 16.25 8C16.25 7.57778 16.3944 7.22222 16.6833 6.93333C16.9722 6.64444 17.3278 6.5 17.75 6.5ZM11 8.75C11.4222 8.75 11.7778 8.89444 12.0667 9.18333C12.3556 9.47222 12.5 9.82778 12.5 10.25C12.5 10.6722 12.3556 11.0278 12.0667 11.3167C11.7778 11.6056 11.4222 11.75 11 11.75C10.5778 11.75 10.2222 11.6056 9.93333 11.3167C9.64444 11.0278 9.5 10.6722 9.5 10.25C9.5 9.82778 9.64444 9.47222 9.93333 9.18333C10.2222 8.89444 10.5778 8.75 11 8.75Z"
                fill={
                  location?.pathname?.split("/")[1] === "services"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Services</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/subscription")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "subscription"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="25"
              height="25"
              viewBox="0 0 96 96"
              fill={
                location?.pathname?.split("/")[1] === "subscription"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M12 24C10.9 24 10 24.9 10 26V70C10 71.1 10.9 72 12 72H84C85.1 72 86 71.1 86 70V26C86 24.9 85.1 24 84 24H12ZM12 22H84C86.21 22 88 23.79 88 26V70C88 72.21 86.21 74 84 74H12C9.79 74 8 72.21 8 70V26C8 23.79 9.79 22 12 22ZM12 58H84V66H12V58ZM12 38H84V48H12V38Z"
                fill={
                  location?.pathname?.split("/")[1] === "questions"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Subscription</span>
          </span>
        </div>
        <div
          onClick={() => navigate("/businessDetails")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "businessDetails"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 96 96"
              fill={
                location?.pathname?.split("/")[1] === "businessDetails"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M16 8H80C81.1 8 82 8.9 82 10V86C82 87.1 81.1 88 80 88H16C14.9 88 14 87.1 14 86V10C14 8.9 14.9 8 16 8ZM16 10V86H80V10H16ZM28 16H68V74H28V16ZM34 22V28H62V22H34ZM34 34V40H62V34H34ZM34 46V52H62V46H34ZM34 58V64H62V58H34ZM34 70V74H62V70H34Z"
                fill={
                  location?.pathname?.split("/")[1] === "businessDetails"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Bussiness Info</span>
          </span>
        </div>
        <div
          onClick={() => navigate("/gallery")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "gallery"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 96 96"
              fill={
                location?.pathname?.split("/")[1] === "gallery"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M12 16H84C85.1 16 86 16.9 86 18V78C86 79.1 85.1 80 84 80H12C10.9 80 10 79.1 10 78V18C10 16.9 10.9 16 12 16ZM12 18V78H84V18H12ZM12 36H84V60H12V36ZM28 48L38 58L58 38L68 48V60L58 50L48 60L38 50L28 60V48Z"
                fill={
                  location?.pathname?.split("/")[1] === "gallery"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Gallery</span>
          </span>
        </div>
        <div
          onClick={() => navigate("/settings")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "settings"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 21"
              fill={
                location?.pathname?.split("/")[1] === "settings"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200">
              <path
                d="M7.665 21L7.245 17.64C7.0175 17.5525 6.8033 17.4475 6.6024 17.325C6.4015 17.2025 6.20445 17.0712 6.01125 16.9312L2.8875 18.2437L0 13.2562L2.70375 11.2087C2.68625 11.0862 2.6775 10.9683 2.6775 10.8549V10.1461C2.6775 10.0321 2.68625 9.91375 2.70375 9.79125L0 7.74375L2.8875 2.75625L6.01125 4.06875C6.20375 3.92875 6.405 3.7975 6.615 3.675C6.825 3.5525 7.035 3.4475 7.245 3.36L7.665 0H13.44L13.86 3.36C14.0875 3.4475 14.302 3.5525 14.5036 3.675C14.7052 3.7975 14.9019 3.92875 15.0938 4.06875L18.2175 2.75625L21.105 7.74375L18.4012 9.79125C18.4187 9.91375 18.4275 10.0321 18.4275 10.1461V10.8538C18.4275 10.9679 18.41 11.0862 18.375 11.2087L21.0787 13.2562L18.1912 18.2437L15.0938 16.9312C14.9012 17.0712 14.7 17.2025 14.49 17.325C14.28 17.4475 14.07 17.5525 13.86 17.64L13.44 21H7.665ZM9.5025 18.9H11.5763L11.9437 16.1175C12.4862 15.9775 12.9895 15.772 13.4536 15.5012C13.9177 15.2302 14.342 14.9019 14.7262 14.5162L17.325 15.5925L18.3487 13.8075L16.0912 12.1012C16.1787 11.8562 16.24 11.5983 16.275 11.3274C16.31 11.0565 16.3275 10.7807 16.3275 10.5C16.3275 10.2193 16.31 9.94385 16.275 9.67365C16.24 9.40345 16.1787 9.14515 16.0912 8.89875L18.3487 7.1925L17.325 5.4075L14.7262 6.51C14.3412 6.1075 13.917 5.7708 13.4536 5.4999C12.9902 5.229 12.4869 5.0232 11.9437 4.8825L11.6025 2.1H9.52875L9.16125 4.8825C8.61875 5.0225 8.1158 5.2283 7.6524 5.4999C7.189 5.7715 6.76445 6.09945 6.37875 6.48375L3.78 5.4075L2.75625 7.1925L5.01375 8.8725C4.92625 9.135 4.865 9.3975 4.83 9.66C4.795 9.9225 4.7775 10.2025 4.7775 10.5C4.7775 10.78 4.795 11.0512 4.83 11.3137C4.865 11.5762 4.92625 11.8387 5.01375 12.1012L2.75625 13.8075L3.78 15.5925L6.37875 14.49C6.76375 14.8925 7.1883 15.2295 7.6524 15.5012C8.1165 15.7727 8.61945 15.9782 9.16125 16.1175L9.5025 18.9ZM10.605 14.175C11.62 14.175 12.4862 13.8162 13.2037 13.0988C13.9212 12.3812 14.28 11.515 14.28 10.5C14.28 9.485 13.9212 8.61875 13.2037 7.90125C12.4862 7.18375 11.62 6.825 10.605 6.825C9.5725 6.825 8.7017 7.18375 7.9926 7.90125C7.2835 8.61875 6.9293 9.485 6.93 10.5C6.9307 11.515 7.28525 12.3812 7.99365 13.0988C8.70205 13.8162 9.5725 14.175 10.605 14.175Z"
                fill={
                  location?.pathname?.split("/")[1] === "settings"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Settings & Config</span>
          </span>
        </div>

        <div
          onClick={() => navigate("/terms-and-conditions")}
          className={`cursor-pointer flex items-center ${location?.pathname?.split("/")[1] === "terms-and-conditions"
            ? "text-[#d4e0ec]"
            : "text-[#909294]"
            }  hover:text-[#d4e0ec]`}>
          <span className="flex items-center ml-2">
            <svg
              width="22"
              height="21"
              viewBox="0 0 24 24"
              fill={
                location?.pathname === "/terms-and-conditions"
                  ? "#107D93"
                  : "currentColor"
              }
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 9l-6 6-3-3 1.41-1.41L12 14.17l4.59-4.59L17 11z"
                fill={
                  location?.pathname === "/terms-and-conditions"
                    ? "#107D93"
                    : "currentColor"
                }
              />
            </svg>

            <span className="text-custom-16 ml-4">Terms & conditions</span>
          </span>
        </div>

        {/* <div
          onClick={toggleModal}
          className="cursor-pointer flex items-center text-[#909294] hover:text-[#dc554e]">
          <span className="flex items-center ml-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M16 17l5-5-5-5M21 12H9" />
              <path d="M9 21H4a2 2 0 01-2-2V5a2 2 0 012-2h5" />
            </svg>
            <span className="text-custom-16 ml-4">Logout</span>
          </span>
        </div> */}
        {/* <Modal
          isVisible={isModalVisible}
          onClose={toggleModal}
          modalHeader={"Are you you want to logout?"}>
          <button
            onClick={() => handleLogout()}
            type="button"
            className="bg-gray-200 p-3 w-full flex justify-center items-center mb-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white">
            Logout
          </button>
        </Modal> */}
      </div>
    </Transition>
  );
}

export default Sidebar;
