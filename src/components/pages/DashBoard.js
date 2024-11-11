import React, { useEffect, useState } from "react";
import DashBoardSection2 from "../DashBoardSection2";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import useBusiness from "../../api/useBusiness";

const DashBoard = () => {
  const navigate = useNavigate();
  const { getBusinessDashboardData } = useBusiness();

  const [dashboardData, setDashboardData] = useState();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getBusinessDashboardData();
        setDashboardData(response);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="bg-white">
      {/* <DashBoard1Top /> */}
      <div className=" w-full">
        <DashBoardSection2 dashboardData={dashboardData} />
      </div>
      {/* <DashBoard3Chart /> */}
      <Button
        sx={{ mt: "2rem" }}
        variant="contained"
        fullWidth
        onClick={() => navigate("/preview")}>
        Template Preview
      </Button>
    </div>
  );
};

export default DashBoard;
