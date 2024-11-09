import placeholder from "../../assets/images/person-placeholder.png";
import { useDispatch, useSelector } from "react-redux";
import useCategory from "../../Hooks/useCategory";
import { useEffect, useState } from "react";
import { setBusinessData } from "../../api/slices/business";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../api/api";

const BusinessDetails = () => {
  const [businessDetails,setBusinessDetails] = useState([]);
  const [category, setCategory ] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isSocialMedia, setSocialMediaModal] = useState(false);

  // State for form data within the modal
  const [formData, setFormData] = useState({
    buildingName: businessDetails?.address?.buildingName || "",
    streetName: businessDetails?.address?.streetName || "",
    landmark: businessDetails?.address?.landmark || "",
    state: businessDetails?.address?.state || "",
    phone: businessDetails?.contactDetails?.phone || "",
    email: businessDetails?.contactDetails?.email || "",
    website: businessDetails?.contactDetails?.website || "",
    description: businessDetails?.description || "",
  });



  const [themeData, setThemeData] = useState({
    theme: businessDetails?.theme || "",
    secondaryTheme: businessDetails?.secondaryTheme || "",
  });
  const dispatch = useDispatch()
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessData = await getApi(`api/v1/business/profile`, true, dispatch, navigate);
        console.log(businessData.data);
        setBusinessDetails(businessData.data);
        setThemeData({
          theme: businessData.data?.theme || "",
          secondaryTheme: businessData.data?.secondaryTheme || "",
        })
        setCategory(businessData?.data.category)
        
      } catch (error) {
        console.error("Error fetching business details:", error.message || error);
      } 
    };
    fetchData();
  }, [dispatch, navigate]);

  const handleShowModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleShowSystemModal = () => setIsSystemModalOpen(true);
  const handleCloseSystemModal = () => setIsSystemModalOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThemeChange = (e) => {
    console.log(e.target.name, e.target.value,"in theme")
    setThemeData({
      ...themeData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = () => {
    const updatedBusinessDetails = {
      ...businessDetails,
      address: {
        ...businessDetails.address,
        buildingName: formData.buildingName,
        streetName: formData.streetName,
        landmark: formData.landmark,
        state: formData.state,
      },
      contactDetails: {
        ...businessDetails.contactDetails,
        phone: formData.phone,
        email: formData.email,
      },
      website: formData.website,
      description: formData.description,
    };
    dispatch(setBusinessData(updatedBusinessDetails));

    handleCloseModal();
  };

  const handleSystemSettingsSubmit = () => {
    console.log("updated theme", themeData);
    const updatedBusinessDetails = {
      ...businessDetails,
      theme:themeData.theme,
    }
    dispatch(setBusinessData(updatedBusinessDetails));
    handleCloseSystemModal();
  };


  return (
    <div className="m-4 mx-auto bg-white shadow-md rounded-lg p-6 mt-4 border border-gray-200 relative">
      {/* Business Details */}
      <div className="flex items-center">
        <img
          src={businessDetails?.logo ?? placeholder}
          alt="Business Logo"
          className="w-32 h-32 border-2 border-gray-300 object-cover"
        />
        <div className="ml-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {businessDetails?.businessName || "Business Name not available"}
          </h2>
          <p className="text-gray-500">
            {category?.name || "Category not specified"}
          </p>
        </div>
      </div>

      {/* Contact & Location Details Section */}
      <div className="mt-4 relative">
        <h3 className="font-semibold text-gray-600">
          Contact & Location Details
        </h3>

        {/* Edit Icon Button */}
        <button
          onClick={handleShowModal}
          className="absolute top-0 right-0 p-2"
        >
          <img
            src="/icons/edit.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
          />
        </button>

        <table className="w-full mt-4">
          <tbody>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Building Name</td>
              <td>
                {businessDetails?.address?.buildingName || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Street name</td>
              <td>
                {businessDetails?.address?.streetName || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Landmark</td>
              <td>
                {businessDetails?.address?.landmark || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">State</td>
              <td>
                {businessDetails?.address?.state || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Phone</td>
              <td>
                {businessDetails?.contactDetails?.phone || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Email</td>
              <td>
                {businessDetails?.contactDetails?.email || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Website</td>
              <td>
                <a
                  href={businessDetails?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {businessDetails?.contactDetails?.website || "Not available"}
                </a>
              </td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-600 w-1/4">Description</td>
              <td>
                {businessDetails?.description || "Description not available"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* System Settings Section */}
      <div className="mt-6 relative">
        <h3 className="font-semibold text-gray-600">System Settings</h3>

        {/* Edit Icon Button */}
        <button
          onClick={handleShowSystemModal}
          className="absolute top-0 right-0 p-2"
        >
          <img
            src="/icons/edit.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
          />
        </button>

        <div className="mt-4">
          <p className="font-semibold text-gray-600">
            Theme: {businessDetails?.theme || "Not available"}
          </p>
          <p className="font-semibold text-gray-600">
            Secondary Theme:{" "}
            {businessDetails?.secondaryTheme || "Not available"}
          </p>
        </div>
      </div>

      <div className="mt-6 relative">
        <h3 className="font-semibold text-gray-600">Social Media</h3>

        {/* Edit Icon Button */}
        <button
          onClick={setSocialMediaModal}
          className="absolute top-0 right-0 p-2"
        >
          <img
            src="/icons/edit.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
          />
        </button>

        <div className="mt-4">
  {businessDetails?.socialMediaLinks?.map((link, index) => (
    <div>
          <a href={link?.link} key={index} className="font-semibold text-gray-600">
      {link.tag}: {link?.link || "Not available"}
    </a>
    </div>
  ))}
</div>

      </div>


      {isSocialMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Edit Social Media Details
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="buildingName"
                value={formData.socialMediaLinks[0].tag}
                onChange={handleChange}
                placeholder="Building Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="streetName"
                key={0}
                value={formData.socialMediaLinks[0].link}
                onChange={handleChange}
                placeholder="Street Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="landmark"
                value={formData.socialMediaLinks[1].link}
                onChange={handleChange}
                placeholder="Landmark"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="state"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Edit Contact & Location Details
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                placeholder="Building Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                placeholder="Street Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Landmark"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="state"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {isSystemModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit System Settings</h3>
            <div className="space-y-3">
              <label>Primary Color: {formData.theme}</label>
              <input
                type="color"
                name="theme"
                value={formData.theme}
                onChange={handleThemeChange}
                placeholder="Theme"
                className="border border-gray-300  w-full rounded"
              />
              <label>Secondary Color: {formData.secondaryTheme}</label>
              <input
                type="color"
                name="secondaryTheme"
                value={formData.secondaryTheme}
                onChange={handleThemeChange}
                placeholder="Secondary Theme"
                className="border border-gray-300  w-full rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseSystemModal}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSystemSettingsSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
