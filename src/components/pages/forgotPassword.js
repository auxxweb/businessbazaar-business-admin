import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useForgotPasswordMutation } from "../../api/auth";
import { useRef } from "react";
import useBusiness from "../../api/useBusiness";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {forgotPassword,isSuccess,loading}=useBusiness()

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    try {
      const body = {
        email,
      };
      const res = await forgotPassword(email)
      // toast.success(res?.data?.msg);
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div
        className="relative min-h-screen bg-cover bg-[#e7edf4] "
        style={{ color: "grey" }}>
        <div className="relative z-10 flex flex-col h-full items-center space-y-4 justify-center p-3 ">
          <div className="flex flex-row w-28 h-auto justify-center ">
            {/* <img
              src="/quranLogo.svg"
              alt=" Logo"
              className="h-full w-full object-contain"
              priority
            /> */}
          </div>
          <div className="w-full max-w-lg ">
            <form
              onSubmit={onSubmit}
              className="bg-white border-grey space-y-3 sm:space-y-4 border-[#105193] shadow-lg rounded-lg text-center py-8 sm:py-10 px-3 sm:px-8  w-full">
              <div className="flex justify-center mb-6">
                <img
                  src="/enconnectLogo.png"
                  alt="Logo"
                  className="h-24 object-contain"
                />
              </div>
              <h1 className="text-3xl font-semibold text-center text-[#333]">
                Forgot Password
              </h1>
              <h3 className=" text-sm sm:text-base text-[#686219]">
              Enter your email to reset your password.
              </h3>

              {/* Email Input Field */}
              <div className="relative mb-10 group space-y-1 items-center">
                {/* Increased margin for spacing */}
                <label
                  className=" px-2 sm:px-3 py-1 text-base sm:text-lg font-medium  bg-transparent m-auto" // Increased padding and adjusted label positioning
                  htmlFor="name">
                  Email address
                </label>
                <input
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-[#105193] text-gold-500 placeholder-gold-500 rounded-[22px] bg-transparent focus:ring-2 focus:ring-[#105193] outline-none focus:border-gold-600 "
                  type="email"
                  // value={""}
                  id="email"
                  placeholder="Email"
                  name="email"
                  required
                />
              </div>

              {/* Password Input Field */}

              {/* Forgot Password Link (Right-aligned under Password) */}
              <div className="flex justify-between mb-8 text-sm text-[#105193] ">
                <span className="space-x-2 flex items-center">
                </span>
                <span
                  onClick={() => navigate("/")}
                  className="hover:underline cursor-pointer"
                >
                  Back to login
                </span>
              </div>

              {/* Sign In Button */}
              <div className="pt-3">
                <button
                  disabled={loading || isSuccess}
                  className="w-full py-3 bg-gradient-to-r from-[#105193] to-[#107D93] text-white font-semibold rounded-lg hover:translate-y-1 transform transition duration-300 "
                  type="submit">
                  Send mail
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
