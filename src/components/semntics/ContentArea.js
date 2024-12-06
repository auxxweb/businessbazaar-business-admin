import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Page imports
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
import Plans from "../pages/Plans";
import PreviewTemplates from "../pages/PreviewTemplates";
import Razorpay from "../Razorpay/Razorpay";

function ContentArea() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname,"pathName")
    const storedToken = JSON.parse(localStorage.getItem("userCredential"));
    if (!storedToken && !location.pathname.match(/\/(forgotPassword|changePassword)/)) {
      navigate("/login");
    } else {
      setToken(storedToken);
    }
  }, [location.pathname, navigate]);

  const routes = [
    { path: "/", element: <DashBoard />, protected: true },
    { path: "/login", element: <Login /> },
    { path: "/forgotPassword", element: <ForgotPassword /> },
    { path: "/changePassword/:id", element: <ChangePassword /> },
    { path: "/zones", element: <Zones />, protected: true },
    { path: "/blogs", element: <News />, protected: true },
    { path: "/landing-page", element: <LandingPage />, protected: true },
    { path: "/welcome-page", element: <WelcomePage />, protected: true },
    { path: "/products", element: <Judges />, protected: true },
    { path: "/judges/:id", element: <JudgeDetails />, protected: true },
    { path: "/special-services", element: <SpecialServices />, protected: true },
    { path: "/services", element: <BasicServices />, protected: true },
    { path: "/participants/:id", element: <ParticipantDetails />, protected: true },
    { path: "/questions/:id", element: <QuestionDetails />, protected: true },
    { path: "/bundles", element: <Bundles />, protected: true },
    { path: "/bundles/:id", element: <BundleDetails />, protected: true },
    { path: "/result", element: <ResponseAndResult />, protected: true },
    { path: "/subscription", element: <Subscription />, protected: true },
    { path: "/plans", element: <Plans />, protected: true },
    { path: "/payment", element: <Razorpay />, protected: true },
    { path: "/previewtemplate", element: <PreviewTemplates />, protected: true },
    { path: "/settings", element: <SettingAndConfi />, protected: true },
    { path: "/businessDetails", element: <BusinessDetails />, protected: true },
    { path: "/gallery", element: <Gallery />, protected: true },
    { path: "/terms-and-conditions", element: <TermsAndConditions />, protected: true },
    { path: "/privacy-policies", element: <PrivacyPolicies />, protected: true },
    { path: "/preview", element: <Preview />, protected: true },
    { path: "/preview/premium", element: <PremiumPreview />, protected: true },
  ];

  const renderRoute = ({ path, element, protected: isProtected }) => (
    <Route
      key={path}
      path={path}
      element={isProtected && !token ? <Login /> : element}
    />
  );

  return <Routes>{routes.map(renderRoute)}</Routes>;
}

export default ContentArea;
