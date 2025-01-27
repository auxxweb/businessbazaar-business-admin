import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useLeads from "../../Hooks/useLeads";
import BackdropLoader from "../reUsableCmponent/BackdropLoader";

import Loader from "../Loader/Loader";
import Pagination from "../Pagination";

const Zones = () => {
  const { leads, loading, totalLeads, fetchLeads } = useLeads();
 
  

  const [searchValue, setSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 

  console.log(Math.ceil(totalLeads / limit),"apple", totalLeads);

  const handleSearchChange = useDebouncedCallback(
    // function
    (value) => {
      setSearchValue(value ?? "");
    },
    500
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLeads({ page: currentPage, limit, searchTerm: searchValue });
    };
    fetchData();
  }, [currentPage, searchValue]);

  return (
    <>
      <div className="flex rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-700">Leads</h2>
      </div>
      <div className="ml-auto lg:mr-4 flex items-center space-x-4 justify-end pt-3">
        {/* Parent div for span elements */}
        <span className="flex items-center justify-center">
          <input
            className="p-2 lg:w-[250px] w-full appearance-none bg-white border border-gray-400 rounded-3xl"
            placeholder="Search by name"
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
          />
        </span>
        {/* <span className="flex items-center ">
          <span className="cursor-pointer bg-[#105193] hover:bg-[#107D93] text-white p-2 lg:w-[100px] text-center rounded-3xl">
            Search
          </span>
        </span> */}
      </div>

      <table className="min-w-full table-auto mt-6 border-collapse">
        <thead className="bg-white border-gray-400 border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px]">
          <tr>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Sl No
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Name
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Email
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Phone number
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Message
            </th>
          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-70 border-[#969696]">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center">
                <div className="flex justify-center items-center">
                  <Loader />
                </div>
              </td>
            </tr>
          ) : (
            leads?.map((lead, index) => (
              <tr
                className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
                key={index}>
                <td className="px-4 py-2 border-r border-gray-400">
                  {index + 1}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  className="px-4 py-2 border-r border-gray-400">
                  <u
                    style={{ cursor: "pointer" }}
                    onMouseOver={({ target }) => (target.style.color = "blue")}
                    onMouseOut={({ target }) => (target.style.color = "black")}>
                    {lead?.name}
                  </u>
                </td>

                <td className="px-4 py-2 border-r border-gray-400">
                  <div className="flex -space-x-2">{lead?.email}</div>
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                  <div className="flex -space-x-2">{lead?.phoneNumber}</div>
                </td>

                <td className="px-4 py-2 border-r border-gray-400">
                  <div className="flex -space-x-2">{lead?.message}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="m-auto flex justify-end">
        <Pagination
          itemsPerPage={10}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalLeads}
        />
      </div>
    </>
  );
};

export default Zones;
