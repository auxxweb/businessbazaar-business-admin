import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Subscription from "../Subscription";
import SettingAndConfi from "../pages/SettingAndConfi";
import JudgeDetails from "../pages/JudgeDetails";
import DashBoard from "../pages/DashBoard";
import Zones from "../pages/leads";
import News from "../pages/News";
import Login from "../pages/Login";
import Judges from "../pages/products";
import Bundles from "../pages/Bundles";
import ParticipantDetails from "../pages/businessDetails";
import QuestionDetails from "../pages/questionDetails";
import BundleDetails from "../pages/BundleDetails";
import ResponseAndResult from "../pages/ResponseAndResult";
import ForgotPassword from "../pages/forgotPassword";
import ChangePassword from "../pages/changePassword";
import BusinessDetails from "../pages/businessDetails";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicies from "../pages/PrivacyPolicies";
import BasicServices from "../pages/basicServices";
import LandingPage from "../pages/LandingPage";
import WelcomePage from "../pages/WelcomePage";
import PremiumPreview from "../pages/PremiumPreview";
import Preview from "../pages/Preview";
import SpecialServices from "../pages/SpecialServices";
import Gallery from "../pages/Gallery";

function ContentArea() {
  const [token, setToken] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("userCredential"));
    console.log(location?.pathname, "pathname");

    // Check if the current route is not forgotpassword or resetpassword
    if (
      !storedToken &&
      !(
        location.pathname.startsWith("/changePassword") ||
        location.pathname === "/forgotPassword"
      )
    ) {
      navigate("/login");
    } else if (storedToken) {
      setToken(storedToken); // Set token if it exists
    }
  }, [navigate, location]);

  return (
    <Routes>
      {/* Use Routes to define all your app routes */}
      <Route path="/" element={token ? <DashBoard /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/changePassword/:id" element={<ChangePassword />} />
      <Route path="/zones" element={token ? <Zones /> : <Login />} />
      <Route path="/news" element={token ? <News /> : <Login />} />
      <Route
        path="/landing-page"
        element={token ? <LandingPage /> : <Login />}
      />
      <Route
        path="/welcome-page"
        element={token ? <WelcomePage /> : <Login />}
      />
      <Route path="/products" element={token ? <Judges /> : <Login />} />
      <Route
        path="/judges/:id"
        element={token ? <JudgeDetails /> : <Login />}
      />
      <Route
        path="/special-services"
        element={token ? <SpecialServices /> : <Login />}
      />
      <Route path="/services" element={token ? <BasicServices /> : <Login />} />
      <Route
        path="/participants/:id"
        element={token ? <ParticipantDetails /> : <Login />}
      />
      <Route
        path="/questions/:id"
        element={token ? <QuestionDetails /> : <Login />}
      />
      <Route path="/bundles" element={token ? <Bundles /> : <Login />} />
      <Route
        path="/bundles/:id"
        element={token ? <BundleDetails /> : <Login />}
      />
      <Route
        path="/result"
        element={token ? <ResponseAndResult /> : <Login />}
      />
      <Route
        path="/subscription"
        element={token ? <Subscription /> : <Login />}
      />
      <Route
        path="/settings"
        element={token ? <SettingAndConfi /> : <Login />}
      />
      <Route
        path="/businessDetails"
        element={token ? <BusinessDetails /> : <Login />}
      />
      <Route path="/gallery" element={token ? <Gallery /> : <Login />} />
      <Route
        path="/terms-and-conditions"
        element={token ? <TermsAndConditions /> : <Login />}
      />
      <Route
        path="/privacy-policies"
        element={token ? <PrivacyPolicies /> : <Login />}
      />
      <Route path="/preview" element={token ? <Preview /> : <Login />} />
      <Route
        path="/preview/premium"
        element={token ? <PremiumPreview /> : <Login />}
      />
    </Routes>
  );
}

export default ContentArea;
