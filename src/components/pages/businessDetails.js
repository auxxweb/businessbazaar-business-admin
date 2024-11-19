import placeholder from "../../assets/images/person-placeholder.png";
import { useDispatch, useSelector } from "react-redux";
import useCategory from "../../Hooks/useCategory";
import { useEffect, useLayoutEffect, useState } from "react";
import { setBusinessData } from "../../api/slices/business";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../api/api";
import { HiMenuAlt1 } from "react-icons/hi";

const BusinessDetails = () => {
  const [businessDetails, setBusinessDetails] = useState([]);
  const [category, setCategory] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isSocialMedia, setSocialMediaModal] = useState(false);
  const [socialLinks,setSocialLinks] = useState({
    facebook:null,
    instagram:null,
    twitter:null
  })

  // State for form data within the modal
  const [formData, setFormData] = useState({
    buildingName: businessDetails?.address?.buildingName || "",
    streetName: businessDetails?.address?.streetName || "",
    landmark: businessDetails?.address?.landMark || "",
    state: businessDetails?.address?.state || "",
    phone: businessDetails?.contactDetails?.phone || "",
    email: businessDetails?.contactDetails?.email || "",
    website: businessDetails?.contactDetails?.website || "",
    description: businessDetails?.description || "",
    socialMediaLinks:businessDetails?.socialMediaLinks || []
    
  });



  const [themeData, setThemeData] = useState({
    theme: businessDetails?.theme || "",
    secondaryTheme: businessDetails?.secondaryTheme || "",
  });
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessData = await getApi(
          `api/v1/business/profile`,
          true,
          dispatch,
          navigate
        );
        console.log(businessData.data);
        setBusinessDetails(businessData.data);
        setThemeData({
          theme: businessData.data?.theme || "",
          secondaryTheme: businessData.data?.secondaryTheme || "",
        });
        setSocialLinks(businessData?.data?.socialMediaLinks)
        setCategory(businessData?.data.category);
       
      } catch (error) {
        console.error(
          "Error fetching business details:",
          error.message || error
        );
      }
    };
    fetchData();
  }, [dispatch, navigate]);

  useEffect(()=>{
    setFormData({
      buildingName: businessDetails?.address?.buildingName ,
      streetName: businessDetails?.address?.streetName ,
      landmark: businessDetails?.address?.landMark ,
      state: businessDetails?.address?.state ,
      phone: businessDetails?.contactDetails?.phone ,
      email: businessDetails?.contactDetails?.email ,
      website: businessDetails?.contactDetails?.website ,
      description: businessDetails?.description ,
      socialMediaLinks:businessDetails?.socialMediaLinks 
    })
  },[businessDetails])

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
    console.log(e.target.name, e.target.value, "in theme");
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
      theme: themeData.theme,
    };
    dispatch(setBusinessData(updatedBusinessDetails));
    handleCloseSystemModal();
  };

  return (
    <div className="m-4 mx-auto bg-transparent  shadow-md rounded-lg p-6 mt-4 border border-gray-200 relative">
      <div
        className="h-full w-full absolute z-0 top-0 left-0"
        style={{
          backgroundImage: `url(${businessDetails?.logo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backfaceVisibility: "revert",
          opacity: "0.2",
        }}
      ></div>
      {/* Business Details */}
      <div className=" block md:flex  bg-transparent relative">
        <img
          src={businessDetails?.logo ?? placeholder}
          alt="Business Logo"
          className="w-full sm:w-1/2 md:w-1/3 mb-3 sm:mb-0 mx-auto h-fit rounded border shadow  object-cover"
        />
        <div className="ml-6  px-2">
          {/* Edit Icon Button */}
          <button onClick={handleShowModal} className=" p-2 float-end">
            <img
              src="/icons/edit.svg"
              alt="Edit"
              className="w-5 h-5 cursor-pointer"
            />
          </button>
          <h1  className=" font-semibold text-gray-800">
            {businessDetails?.businessName }
          </h1>
          <p className="text-gray-500 italic">
            {category?.name || "Category not specified"}
          </p>
          <p className="font-medium">
            {businessDetails?.description}
          </p>
          <div>
            <h5 className="font-bold text-gray-400">Contact Us</h5>
            <p
              className={`${
                businessDetails?.address?.buildingName ?? "hidden"
              }`}
            >
              {" "}
              {businessDetails?.address?.buildingName}
            </p>
            <p
              className={`${businessDetails?.address?.streetName ?? "hidden"}`}
            >
              {" "}
              {businessDetails?.address?.streetName}
            </p>
            <p className={`${businessDetails?.address?.landMark ?? "hidden"}`}>
              {" "}
              {businessDetails?.address?.landMark}
            </p>
            <p className={`${businessDetails?.address?.state ?? "hidden"}`}>
              {" "}
              {businessDetails?.address?.state}
            </p>
            <p
              className={`${
                businessDetails?.contactDetails?.email ?? "hidden"
              }`}
            >
              Email: {businessDetails?.contactDetails?.email}
            </p>
            <p
              className={`${
                businessDetails?.contactDetails?.phone ?? "hidden"
              } `}
            >
              Phone: {businessDetails?.contactDetails?.phone}
            </p>
            <p
              className={`${
                businessDetails?.contactDetails?.website ?? "hidden"
              } `}
            >
              Website:{" "}
              <a
                href={businessDetails?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {" "}
                {businessDetails?.contactDetails?.website}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 ">
            <p className="p-0 m-0 ">Follow Us On:</p>
            {!socialLinks?.twitter && <a className="cursor-pointer" href={socialLinks?.twitter}>
            <svg
              className="w-10 h-10 "
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 1668.56 1221.19"
              viewBox="0 0 1668.56 1221.19"
              id="twitter-x"
            >
              <circle
                cx="834.28"
                cy="610.6"
                r="481.33"
                stroke="#fff"
                stroke-miterlimit="10"
              ></circle>
              <path
                fill="#fff"
                d="M485.39,356.79l230.07,307.62L483.94,914.52h52.11l202.7-218.98l163.77,218.98h177.32
			L836.82,589.6l215.5-232.81h-52.11L813.54,558.46L662.71,356.79H485.39z M562.02,395.17h81.46l359.72,480.97h-81.46L562.02,395.17
			z"
                transform="translate(52.39 -25.059)"
              ></path>
            </svg>
            </a>}
            {!socialLinks?.facebook && <a className="cursor-pointer" href={socialLinks?.facebook}>
            <svg
              className="w-8 h-8 "
              fill="#000000"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
            </svg>
            </a>}
          
            {!socialLinks?.instagram && <a className="cursor-pointer" href={socialLinks?.instagram}>
              <svg
              width="27px"
              height="27px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                fill="#0F0F0F"
              />
              <path
                d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                fill="#0F0F0F"
              />
              <path
                fillRule="evenodd"
                clipPule="evenodd"
                d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                fill="#0F0F0F"
              />
            </svg>
            </a>}
            <button
          onClick={(()=>setSocialMediaModal(true))}
          className="  ms-auto float-end "
        >
          <img
            src="/icons/edit.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
          </div>
        </div>
      </div>

      {/* System Settings Section */}
      <div className="mt-6 relative">
        <div className="mt-4 flex gap-2 items-center justify-end">
          <p className="font-semibold text-gray-600 p-0 m-0">
            Theme: 
          </p>
            <div style={{backgroundColor:businessDetails?.theme}} className={`shadow w-10 h-10 rounded-xl border`}></div>
          <p className="font-semibold text-gray-600 p-0 m-0">
            Secondary Theme:{" "}
          </p>
            <div style={{backgroundColor:businessDetails?.secondaryTheme}} className={` shadow w-10 h-10 rounded-xl border`}></div>
        <button
          onClick={handleShowSystemModal}
          className=" float-end p-2"
        >
          <img
            src="/icons/edit.svg"
            alt="Edit"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
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
                value={formData?.socialMediaLinks[0]?.link}
                onChange={handleChange}
                placeholder="Building Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="streetName"
                key={0}
                value={formData?.socialMediaLinks[0]?.link}
                onChange={handleChange}
                placeholder="Street Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="landmark"
                value={formData?.socialMediaLinks[1]?.link}
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
                value={formData?.buildingName}
                onChange={handleChange}
                placeholder="Building Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="streetName"
                value={formData?.streetName}
                onChange={handleChange}
                placeholder="Street Name"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="landmark"
                value={formData?.landmark}
                onChange={handleChange}
                placeholder="Landmark"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="state"
                value={formData?.state}
                onChange={handleChange}
                placeholder="state"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                name="website"
                value={formData?.website}
                onChange={handleChange}
                placeholder="Website"
                className="border border-gray-300 p-2 w-full rounded"
              />
              <textarea
                name="description"
                value={formData?.description}
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
                value={formData?.theme}
                onChange={handleThemeChange}
                placeholder="Theme"
                className="border border-gray-300  w-full rounded"
              />
              <label>Secondary Color: {formData.secondaryTheme}</label>
              <input
                type="color"
                name="secondaryTheme"
                value={formData?.secondaryTheme}
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
