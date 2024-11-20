import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useRef, useState } from "react";
import useBusiness from "../../api/useBusiness";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const { id } = useParams();
  const { loading,resetpassword } = useBusiness();

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target); // Make sure event.target is the form
    const cPassword = formData.get("cpassword"); // Get email input value
    const password = formData.get("password");

    try {
      if (cPassword !== password) {
        toast.warning("Password and confirm password do not match.", {
          theme: "colored",
          position: "top-right",
          style: {
            backgroundColor: "#cddb2e",
            color: "white",
            height: "60px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }
        });
      } else {
        const body = {
          password,
          resetId: id
        };

         await resetpassword(body);
      }
    } catch (error) {
      console.log("error", error);
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
                  src="/logo.jpeg"
                  alt="Logo"
                  className="h-24 object-contain"
                />
              </div>
              <h1 className="text-3xl font-semibold text-center text-[#333]">
                Reset password
              </h1>
              <h3 className=" text-sm sm:text-base text-[#686219]">
                Enter new password and continue!
              </h3>

              {/* Email Input Field */}
              <div className="relative  group  space-y-1">
                <label
                  className=" px-2 sm:px-3 py-1 text-base sm:text-lg font-medium  bg-transparent m-auto" // Increased padding and adjusted label positioning
                  htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-[#105193] text-gold-500 placeholder-gold-500 rounded-[22px] bg-transparent focus:ring-2 focus:ring-[#105193] outline-none focus:border-gold-600 "
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    class="absolute inset-y-0 end-0 text-xl  flex items-center  z-20 px-3  cursor-pointer text-[#888888] rounded-e-md   ">
                    {showPassword ? <PiEyeSlashFill /> : <PiEyeFill />}
                  </button>
                </div>
              </div>

              {/* Password Input Field */}
              <div className="relative  group  space-y-1">
                <label
                  className=" px-2 sm:px-3 py-1 text-base sm:text-lg font-medium  bg-transparent m-auto" // Increased padding and adjusted label positioning
                  htmlFor="cpassword">
                  confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-[#105193] text-gold-500 placeholder-gold-500 rounded-[22px] bg-transparent focus:ring-2 focus:ring-[#105193] outline-none focus:border-gold-600 "
                    type={showCPassword ? "text" : "password"}
                    id="cpassword"
                    name="cpassword"
                    placeholder="confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPassword(!showCPassword)}
                    class="absolute inset-y-0 end-0 text-xl  flex items-center  z-20 px-3  cursor-pointer text-[#888888] rounded-e-md   ">
                    {showCPassword ? <PiEyeSlashFill /> : <PiEyeFill />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link (Right-aligned under Password) */}
              <div className="flex justify-between mb-8 text-sm text-[#105193] ">
                <span className="space-x-2 flex items-center"></span>
              </div>

              {/* Sign In Button */}
              <div className="pt-3">
                <button
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#105193] to-[#107D93] text-white font-semibold rounded-lg hover:translate-y-1 transform transition duration-300 "
                  type="submit">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
