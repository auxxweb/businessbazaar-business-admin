import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getApi } from "../api/api";

const useBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [colorTheme, setColorTheme] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [closeDays, setCloseDays] = useState([]);
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const fetchBusinessData = async () => {
    setLoading(true);
    const businessDetails = await getApi(
      `api/v1/business/profile`,
      true,
      dispatch,
      navigate
    );
    setBusinessData(businessDetails?.data);
    setIsPremium(businessDetails?.data?.selectedPlan?.isPremium);
    setColorTheme(businessDetails.data.theme);

    const closed = allDays.filter(
      (day) =>
        !businessDetails.data.businessTiming.workingDays
          .map((d) => d.toLowerCase())
          .includes(day)
    );
    setCloseDays(closed);

    setLoading(false);
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  return {
    loading,
    businessData,
    closeDays,
    colorTheme,
    isPremium,
  };
};

export default useBusiness;
