import React from "react";
import DashBoardSection2 from "../DashBoardSection2";
import DashBoard3Chart from "../DashBoard3Chart";
import { useNavigate } from 'react-router-dom';


const DashBoard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
        {/* <DashBoard1Top /> */}
      <div className=" w-full">
        <DashBoardSection2 />
      </div>
      {/* <DashBoard3Chart /> */}
      <button className={"btn mt-4 border-r-2"} onClick={() => navigate("/preview")}>Preview</button>

    </div>
  );
};

export default DashBoard;
