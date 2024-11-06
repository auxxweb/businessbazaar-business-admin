
import placeholder from "../../assets/images/person-placeholder.png"
import { useSelector } from "react-redux";

const BusinessDetails = () => {
  const businessDetails = useSelector((state) => state.business.data);

  return (
    <>

      <div className="m-4 mx-auto bg-white shadow-md rounded-lg p-6 mt-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start w-full">
          {/* Left Section: Logo & Business Info */}
          <div className="flex lg:w-1/2">
            <div className="w-32 h-32  overflow-hidden border-2 border-gray-300">
              <img
                src={businessDetails?.logo ?? placeholder}
                alt="Business Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Business Info */}
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {businessDetails?.businessName || "Business Name not available"}
              </h2>
              <p className="text-gray-500 mt-1 flex items-center">
                
                {businessDetails.category || "Category not specified"}
              </p>
              <p>
                {businessDetails.description || "Description not specified"}
              </p>
            </div>
          </div>

          {/* Right Section: Contact & Location Details */}
          <div className="flex flex-col lg:w-1/2">
            <div className="mt-4 lg:mt-0">
              <table className="w-full">
                <tbody className="space-y-2">
                  <tr className="mt-4">
                    <td className="font-semibold text-gray-600 w-1/4">Phone</td>
                    <td>{businessDetails.contactDetails.phone || "Not available"}</td>
                  </tr>
                  <tr className="mt-4">
                    <td className="font-semibold text-gray-600 w-1/4">Email</td>
                    <td>{businessDetails.contactDetails.email || "Not available"}</td>
                  </tr>
                  <tr className="mt-4">
                    <td className="font-semibold text-gray-600 w-1/4">Location</td>
                    <td>{businessDetails?.address?.state || "Location not specified"}</td>
                  </tr>
                  <tr className="mt-4">
                    <td className="font-semibold text-gray-600 w-1/4">Website</td>
                    <td>
                      <a
                        href={businessDetails?.contactDetails?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {businessDetails?.contactDetails?.website || "Not available"}
                      </a>
                    </td>
                  </tr>
                  <tr className="mt-4">
                    <td className="font-semibold text-gray-600 w-1/4">Description</td>
                    <td>{businessDetails?.description || "Description not available"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDetails;
