import React from "react";
import DashBoardSection2 from "../DashBoardSection2";
import DashBoard3Chart from "../DashBoard3Chart";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";


const DashBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
        {/* <DashBoard1Top /> */}
      <div className=" w-full">
        <DashBoardSection2 />
      </div>
      {/* <DashBoard3Chart /> */}
      <Button sx={{mt:"2rem"}} variant="contained" fullWidth onClick={() => navigate("/preview")}>Template Preview</Button>

    </div>
  );
};

export default DashBoard;
