import React, { useEffect, useState } from "react";
import participats from "../assets/images/participats.png";
import judges from "../assets/images/judges.png";
import zones from "../assets/images/zones.png";
const DashBoardSection2 = ({ dashboardData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format the time as HH:MM:SS AM/PM
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  // Function to add the suffix to the day (st, nd, rd, th)
  const formatDayWithSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`; // Special case for 11th-19th
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  // Get the current date
  const currentDate = new Date();
  const dayWithSuffix = formatDayWithSuffix(currentDate.getDate());
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <>
      <div className="flex flex-col space-y-4 ">
        <div className="w-full px-2 py-5 text-left bg-white shadow-md border border-gray-300 gap-5 sm:gap-10  mr-4 flex items-center justify-center rounded-2xl">
          <div className="text-left">
            <div className="flex justify-center items-center text-xl text-gray-500 ">
              <span>{`${dayWithSuffix} ${month} ${year}`}</span>
            </div>
          </div>
          <div className="text-gray-700 text-2xl font-light  ">
            {formattedTime}
          </div>
        </div>

        {/* Right Column (Grid of 6 items in 2 rows, 3 columns) */}
        <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl flex items-center space-x-3 justify-between shadow-md border border-gray-300">
            <div className="flex flex-col ">
              <h2 className="text-3xl font-semibold">{dashboardData?.totalServiceCount ?? 0}</h2>

              <p className=" text-black ">Total Services</p>
            </div>{" "}
            <div>
              <img src={judges} className="h-12 w-12 object-contain" />
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-2xl flex items-center space-x-3 justify-between shadow-md border border-gray-300">
            <div className="flex flex-col ">
              <h2 className="text-3xl font-semibold">{dashboardData?.totalLeads ?? 0}</h2>

              <p className=" text-black ">Total Leads</p>
            </div>{" "}
            <div>
              <img src={participats} className="h-12 w-12 object-contain" />
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-2xl flex items-center space-x-3 justify-between shadow-md border border-gray-300">
            <div className="flex flex-col ">
              <h2 className="text-3xl font-semibold">{dashboardData?.totalReviews}</h2>

              <p className=" text-black ">Rating</p>
            </div>{" "}
            <div>
              <img src={zones} className="h-12 w-12 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardSection2;
