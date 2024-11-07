import React, { useState } from "react";
import copy from "copy-to-clipboard";
import { useDebouncedCallback } from "use-debounce";
import { LuCopyCheck } from "react-icons/lu";
import { IoMdCopy } from "react-icons/io";

import Pagination from "../Pagination";
import { PUBLIC_USER_FRONTEND_URL } from "../../common/utils";
import { toast } from "sonner";
import useLeads from "../../Hooks/useLeads";
import BackdropLoader from "../reUsableCmponent/BackdropLoader";

const Zones = () => {
  const { leads, loading } = useLeads();
  console.log(leads, "leads");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editPopupData, setEditPopupData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [copied, setCopied] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleEditClick = (zone) => {
    toggleModal();
    setEditPopupData(zone);
  };

  const handleDeleteClick = (id) => {
    setShowDeletePopup(true);
    setSelectedZoneId(id);
  };

  const handleModalClose = () => {
    toggleModal();
    setEditPopupData(null);
  };

  const handleDeleteModalClose = () => {
    setShowDeletePopup(false);
  };
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

  const handleCopy = async (value, mainJudge) => {
    if (mainJudge) {
      setCopied(value);
      copy(PUBLIC_USER_FRONTEND_URL + "/participant/" + value);
      setTimeout(() => {
        setCopied("");
      }, 2000);
    } else {
      toast.error("Please add at least one main judge in this zone.", {
        position: "top-right",
        duration: 2000,
        style: {
          backgroundColor: "#fb0909", // Custom green color for success
          color: "#FFFFFF", // Text color
        },
        dismissible: true,
      });
    }
  };
  return (
    <>
      <div className="flex rounded-lg p-4">
        <BackdropLoader isLoading={loading} />
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
        <span className="flex items-center ">
          <span className="cursor-pointer bg-[#105193] hover:bg-[#107D93] text-white p-2 lg:w-[100px] text-center rounded-3xl">
            Search
          </span>
        </span>
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
          
            <th className="px-4 py-4 text-left border-r border-gray-400">Phone number</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">Message</th>

          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-70 border-[#969696]">
          {leads?.map((lead, index) => (
            <tr
              className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
              key={index}
            >
              <td className="px-4 py-2 border-r border-gray-400">
                {index + 1}
              </td>
              <td
                style={{ cursor: "pointer" }}
                className="px-4 py-2 border-r border-gray-400"
              >
                <u
                  style={{ cursor: "pointer" }}
                  onMouseOver={({ target }) => (target.style.color = "blue")}
                  onMouseOut={({ target }) => (target.style.color = "black")}
                >
                  {lead?.name}
                </u>
              </td>
              
              <td className="px-4 py-2 border-r border-gray-400">
                <div className="flex -space-x-2">{lead?.email}</div>
              </td>
              <td className="px-4 py-2 border-r border-gray-400">
                <div className="flex -space-x-2">{"+91000000000"}</div>
              </td>

              <td className="px-4 py-2 border-r border-gray-400">
                <div className="flex -space-x-2">{lead?.message}</div>
              </td>
              {/* <td className="px-4 py-2">
                
                <button onClick={() => handleDeleteClick(lead?._id)}>
                  <img
                    alt="pics"
                    src="/icons/delete.svg"
                    className="w-6 h-6 rounded-full mr-2 fill-red-500"
                    style={{
                      filter:
                        "invert(20%) sepia(94%) saturate(7496%) hue-rotate(347deg) brightness(102%) contrast(104%)",
                    }}
                  />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="m-auto flex justify-end">
        <Pagination
          itemsPerPage={limit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={leads?.totalPages}
        />
      </div> */}
    </>
  );
};

export default Zones;
