import placeholder from "../../assets/images/person-placeholder.png";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setBusinessData } from "../../api/slices/business";
import { useNavigate } from "react-router-dom";
import { getApi, patchApi } from "../../api/api";
import Cropper from "react-easy-crop";
import { Button, CloseButton, Modal, Spinner } from "react-bootstrap";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import getCroppedImg from "../../utils/cropper.utils";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

const BusinessDetails = () => {
  const { uploadImage, imageLoading } = useImageUpload();
  const [businessDetails, setBusinessDetails] = useState([]);
  const [updateLoading, setUPdateLoading] = useState(false)
  const [category, setCategory] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isSocialMedia, setSocialMediaModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const resetCropper = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  }

  const [modalState, setModalState] = useState({
    showEdit: false,
    showCreate: false,
    showDelete: false,
    showCrop: false
  });
  const [currentImage, setCurrentImage] = useState({
    index: null,
    image: null,
    preview: "",
    file: null
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleModalState = (type, state) => {
    setModalState((prev) => ({ ...prev, [type]: state }));
  };
  const handleFileChange = async (e, isCreate = false) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage((prev) => ({
        ...prev,
        preview: URL.createObjectURL(file),
      }));
      handleModalState("showCrop", true);
    }
  };

  // State for form data within the modal
  const [formData, setFormData] = useState({
    buildingName: businessDetails?.address?.buildingName || "",
    streetName: businessDetails?.address?.streetName || "",
    landmark: businessDetails?.address?.landMark || "",
    state: businessDetails?.address?.state || "",
    whatsAppNumber: businessDetails?.contactDetails?.whatsAppNumber || "",
    primaryNumber: businessDetails?.contactDetails?.primaryNumber || "",
    secondaryNumber: businessDetails?.contactDetails?.secondaryNumber || "",
    email: businessDetails?.contactDetails?.email || "",
    website: businessDetails?.contactDetails?.website || "",
    description: businessDetails?.description || "",
    socialMediaLinks: businessDetails?.socialMediaLinks || []
  });

  const [themeData, setThemeData] = useState({
    theme: businessDetails?.theme || "",
    secondaryTheme: businessDetails?.secondaryTheme || ""
  });
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const businessData = await getApi(
          `api/v1/business/profile`,
          true,
          dispatch,
          navigate
        );
        console.log(businessData.data);
        setBusinessDetails(businessData.data);

        setCategory(businessData?.data.category);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(
          "Error fetching business details:",
          error.message || error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    setFormData({
      buildingName: businessDetails?.address?.buildingName,
      streetName: businessDetails?.address?.streetName,
      landmark: businessDetails?.address?.landMark,
      state: businessDetails?.address?.state,
      whatsAppNumber: businessDetails?.contactDetails?.whatsAppNumber,
      primaryNumber: businessDetails?.contactDetails?.primaryNumber,
      secondaryNumber: businessDetails?.contactDetails?.secondaryNumber,
      email: businessDetails?.contactDetails?.email,
      website: businessDetails?.contactDetails?.website,
      description: businessDetails?.description,
      socialMediaLinks: businessDetails?.socialMediaLinks
    });
    setCurrentImage(((prev) => ({
      ...prev,
      image: businessDetails?.logo
    })));
    setThemeData({
      theme: businessDetails?.theme,
      secondaryTheme: businessDetails?.secondaryTheme
    });
  }, [businessDetails]);

  const handleShowModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleShowSystemModal = () => setIsSystemModalOpen(true);
  const handleCloseSystemModal = () => setIsSystemModalOpen(false);

  const handleChange = (e) => {
    if (
      e.target.name === "facebook" ||
      e.target.name === "twitter" ||
      e.target.name === "instagram" ||
      e.target.name === "youtube" ||
      e.target.name === "linkedin"
    ) {
      const array = [...formData.socialMediaLinks];
      function updateLinkById(array, tag, newLink) {
        const itemToUpdate = array.find((item) => item?.tag === tag);
        if (itemToUpdate) {
          itemToUpdate.link = newLink;
        }
        return array;
      }
      setFormData({
        ...formData,
        socialMediaLinks: [
          ...updateLinkById(array, e.target.name, e.target.value),
        ],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleThemeChange = (e) => {
    console.log(e.target.name, e.target.value, "in theme");
    setThemeData({
      ...themeData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async () => {
    setUPdateLoading(true)
    let logo = businessDetails?.logo;
    if (currentImage?.file) {
      const imageData = await uploadImage(currentImage.file, "products");
      if (imageData?.accessLink) {
        logo = imageData?.accessLink;
      }
    }
    const updatedBusinessDetails = {
      ...businessDetails,
      logo,
      address: {
        ...businessDetails.address,
        buildingName: formData.buildingName,
        streetName: formData.streetName,
        landMark: formData.landmark,
        state: formData.state
      },
      contactDetails: {
        ...businessDetails.contactDetails,
        whatsAppNumber: formData.whatsAppNumber,
        primaryNumber: formData.primaryNumber,
        secondaryNumber: formData.secondaryNumber,
        website: formData.website,
        email:formData.email
      },
      description: formData.description
    };
    if (updatedBusinessDetails?.email) {
      delete updatedBusinessDetails?.email
    }

    patchApi("api/v1/business", updatedBusinessDetails)
      .then((result) => {
        if (result?.success) {
          setBusinessDetails({ email: businessDetails?.email, ...updatedBusinessDetails });
          dispatch(setBusinessData({ email: businessDetails?.email, ...updatedBusinessDetails }));
        }
        setUPdateLoading(false)
        handleCloseModal();
      })
      .catch((err) => {
        console.log(err);
        setUPdateLoading(false)
        handleCloseModal();
      });

  };

  const handleUpdateSocialMedia = async (e) => {
    setUPdateLoading(true)
    e.preventDefault()
    const updatedSocialMedia = {
      socialMediaLinks: formData?.socialMediaLinks
    };
    patchApi("api/v1/business", updatedSocialMedia)
      .then((result) => {
        if (result?.success) {
          setBusinessDetails({ ...businessDetails, ...updatedSocialMedia });
          dispatch(setBusinessData({ ...businessDetails, ...updatedSocialMedia }));
        }
        setSocialMediaModal(false)
        setUPdateLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setSocialMediaModal(false)
        setUPdateLoading(false)
      });

  }
  const handleSystemSettingsSubmit = () => {
    setUPdateLoading(true)
    const updatedBusinessDetails = {
      theme: themeData.theme,
      secondaryTheme: themeData.secondaryTheme
    };
    patchApi("api/v1/business", updatedBusinessDetails)
      .then((result) => {
        if (result?.success) {
          setBusinessDetails({ ...businessDetails, ...updatedBusinessDetails });
          dispatch(setBusinessData({ ...businessDetails, ...updatedBusinessDetails }));
        }
        setUPdateLoading(false)
        handleCloseSystemModal();
      })
      .catch((err) => {
        setUPdateLoading(false)
        handleCloseSystemModal();
      });
  };

  if (loading) {
    return (
      <div className="h-100vh text-center ">
        <div className="row h-100 justify-content-center align-items-center">
          <FullPageLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="m-4 mx-auto bg-transparent shadow-md rounded-lg p-6 mt-4 border border-gray-200 relative">
        {imageLoading || (loading && <FullPageLoader />)}
        <div
          className="h-full w-full absolute z-0 top-0 left-0"
          style={{
            backgroundImage: `url(${businessDetails?.logo})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
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
            <h1 className=" font-semibold text-gray-800">
              {businessDetails?.businessName}
            </h1>
            <p className="text-gray-500 italic">
              {category?.name || "Category not specified"}
            </p>
            <p className="font-medium">{businessDetails?.description}</p>
            <div>
              <h5 className="font-bold text-gray-400">Contact Us</h5>
              <p
                className={`${businessDetails?.address?.buildingName ?? "hidden"
                  }`}>
                {" "}
                {businessDetails?.address?.buildingName}
              </p>
              <p
                className={`${businessDetails?.address?.streetName ?? "hidden"
                  }`}>
                {" "}
                {businessDetails?.address?.streetName}
              </p>
              <p
                className={`${businessDetails?.address?.landMark ?? "hidden"}`}>
                {" "}
                {businessDetails?.address?.landMark}
              </p>
              <p className={`${businessDetails?.address?.state ?? "hidden"}`}>
                {" "}
                {businessDetails?.address?.state}
              </p>
              <p className={` `}>
               Email:{" "}
                {businessDetails?.contactDetails?.email || (
                  <span className="text-red-500 text-sm">Not Available</span>
                )}
              </p>
              <p className={` `}>
                whatsapp Number:{" "}
                {businessDetails?.contactDetails?.whatsAppNumber || (
                  <span className="text-red-500 text-sm">Not Available</span>
                )}
              </p>
              <p className={` `}>
                Primary Number:{" "}
                {businessDetails?.contactDetails?.primaryNumber || (
                  <span className="text-red-500 text-sm">Not Available</span>
                )}
              </p>
              <p className={` `}>
                Secondary Number :{" "}
                {businessDetails?.contactDetails?.secondaryNumber || (
                  <span className="text-red-500 text-sm">Not Available</span>
                )}
              </p>
              <p
                className={`${businessDetails?.contactDetails?.website ?? "hidden"
                  } `}>
                Website:{" "}
                <a
                  href={businessDetails?.website}
                  target="_blank"
                  rel="no opener no referrer"
                  className="text-blue-500">
                  {" "}
                  {businessDetails?.contactDetails?.website}
                </a>
              </p>
            </div>
            <div className="flex items-center gap-3 ">
              <p className="p-0 m-0 ">Follow Us On:</p>
              {formData?.socialMediaLinks?.map((item, index) => {
                if (item.tag === "facebook") {
                  return <Facebook key={index} url={item?.link} />;
                }
                if (item.tag === "instagram") {
                  return <Instagram key={index} url={item?.link} />;
                }
                if (item.tag === "twitter") {
                  return <Twitter key={index} url={item?.link} />;
                }
                if (item.tag === "youtube") {
                  return <Youtube key={index} url={item?.link} />;
                }
                if (item.tag === "linkedin") {
                  return <LinkedIn key={index} url={item?.link} />;
                }
              })}

              <button
                onClick={() => setSocialMediaModal(true)}
                className="  ms-auto float-end ">
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
            <p className="font-semibold text-gray-600 p-0 m-0">Theme:</p>
            <div
              style={{ backgroundColor: themeData?.theme }}
              className={`shadow w-10 h-10 rounded-xl border`}></div>
            <p className="font-semibold text-gray-600 p-0 m-0">
              Secondary Theme:{" "}
            </p>
            <div
              style={{ backgroundColor: themeData?.secondaryTheme }}
              className={` shadow w-10 h-10 rounded-xl border`}></div>
            <button onClick={handleShowSystemModal} className=" float-end p-2">
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              {updateLoading &&
                <div className="absolute  z-30 bg-white rounded-lg opacity-80 left-0 top-0 w-100 h-100 flex justify-center items-center ">
                  <Spinner className="z-50" variant="success" />
                </div>}
              <h3 className="text-lg font-semibold mb-4">
                Edit Social Media Details
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="facebook"
                  value={
                    formData?.socialMediaLinks.find(
                      (item) => item.tag === "facebook"
                    )?.link
                  }
                  onChange={handleChange}
                  placeholder="FaceBook"
                  className="border border-gray-300 p-2 w-full rounded"
                />

                <input
                  type="text"
                  name="twitter"
                  value={
                    formData?.socialMediaLinks.find(
                      (item) => item.tag === "twitter"
                    )?.link
                  }
                  onChange={handleChange}
                  placeholder="Twitter"
                  className="border border-gray-300 p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="instagram"
                  value={
                    formData?.socialMediaLinks.find(
                      (item) => item.tag === "instagram"
                    )?.link
                  }
                  onChange={handleChange}
                  placeholder="Instagram"
                  className="border border-gray-300 p-2 w-full rounded"
                />

                <input
                  type="text"
                  name="youtube"
                  value={
                    formData?.socialMediaLinks.find(
                      (item) => item.tag === "youtube"
                    )?.link
                  }
                  onChange={handleChange}
                  placeholder="Youtube"
                  className="border border-gray-300 p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="linkedin"
                  value={
                    formData?.socialMediaLinks.find(
                      (item) => item.tag === "linkedin"
                    )?.link
                  }
                  onChange={handleChange}
                  placeholder="linkedIn"
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSocialMediaModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSocialMedia}
                  className="bg-[#105193] text-white px-4 py-2 rounded hover:bg-[#107D93]">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center overflow-y-scroll top-0 pt-32 justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              {updateLoading &&
                <div className="absolute  z-30 bg-white rounded-lg opacity-80 left-0 top-0 w-100 h-100 flex justify-center items-center ">
                  <Spinner className="z-50" variant="success" />
                </div>}
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
                  name="whatsAppNumber"
                  value={formData?.whatsAppNumber}
                  onChange={handleChange}
                  placeholder="Whatsapp Number"
                  className="border border-gray-300 p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="primaryNumber"
                  value={formData?.primaryNumber}
                  onChange={handleChange}
                  placeholder="Primary Number"
                  className="border border-gray-300 p-2 w-full rounded"
                />
                <input
                  type="text"
                  name="secondaryNumber"
                  value={formData?.secondaryNumber}
                  onChange={handleChange}
                  placeholder="Seconday Number"
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
                <label>
                  Image <span style={{ color: "grey" }}>(Ratio 1 : 1)</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2 w-full rounded"
                />
                {currentImage.image && (
                  <img
                    src={currentImage.image}
                    alt="Preview"
                    className="mt-3 w-1/2 h-auto mx-auto "
                    style={{
                      objectFit: "cover",
                      display: "block",
                      marginInline: "auto"
                    }}
                  />
                )}
              </div>
              <div></div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#105193] text-white px-4 py-2 rounded hover:bg-[#107D93]">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Settings Modal */}
        {isSystemModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white relative p-6 rounded-lg shadow-lg w-96 z-10">
              {updateLoading && <div className="absolute  z-30 bg-white rounded-lg opacity-80 left-0 top-0 w-100 h-100 flex justify-center items-center ">
                <Spinner className="z-50" variant="success" />
              </div>}
              <h3 className="text-lg font-semibold mb-4">
                Edit System Settings
              </h3>
              <div className="space-y-3">
                <label>Primary Color: {themeData?.theme}</label>
                <input
                  type="color"
                  name="theme"
                  value={themeData?.theme}
                  onChange={handleThemeChange}
                  placeholder="Theme"
                  className="border border-gray-300  w-full rounded"
                />
                <label>Secondary Color: {themeData?.secondaryTheme}</label>
                <input
                  type="color"
                  name="secondaryTheme"
                  value={themeData?.secondaryTheme}
                  onChange={handleThemeChange}
                  placeholder="Secondary Theme"
                  className="border border-gray-300  w-full rounded"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseSystemModal}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 mr-2">
                  Cancel
                </button>
                <button
                  onClick={handleSystemSettingsSubmit}
                  className="bg-[#105193] text-white px-4 py-2 rounded hover:bg-[#107D93]">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={modalState.showCrop}
        onHide={() => {
          resetCropper()
          handleModalState("showCrop", false)
        }}>
        <Modal.Header >
          <Modal.Title>Crop Image</Modal.Title>
          <CloseButton onClick={() => {
            resetCropper()
            handleModalState("showCrop", false)
          }} />
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container position-relative"
            style={{ height: "400px" }}>
            <Cropper
              image={currentImage.preview}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={async () => {
              const { blob, fileUrl } = await getCroppedImg(
                currentImage.preview,
                croppedAreaPixels
              );
              setCurrentImage((prev) => ({
                ...prev,
                image: fileUrl,
                file: blob
              }));
              handleModalState("showCrop", false);
            }}>
            Crop & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BusinessDetails;

const Twitter = ({ url }) => {
  return (
    <a className="cursor-pointer" target="_blank" href={url}>
      <svg
        className="w-10 h-10 "
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 1668.56 1221.19"
        viewBox="0 0 1668.56 1221.19"
        id="twitter-x"
      >
        <circle
          cx="834.28"
          cy="610.6"
          r="481.33"
          stroke="#fff"
          strokeMiterlimit="10"
        ></circle>
        <path
          fill="#fff"
          d="M485.39,356.79l230.07,307.62L483.94,914.52h52.11l202.7-218.98l163.77,218.98h177.32
L836.82,589.6l215.5-232.81h-52.11L813.54,558.46L662.71,356.79H485.39z M562.02,395.17h81.46l359.72,480.97h-81.46L562.02,395.17
z"
          transform="translate(52.39 -25.059)"
        ></path>
      </svg>
    </a>
  );
};

const Facebook = ({ url }) => {
  return (
    <a className="cursor-pointer" target="_blank" href={url}>
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
    </a>
  );
};

const Instagram = ({ url }) => {
  return (
    <a className="cursor-pointer" target="_blank" href={url}>
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
          clippule="evenodd"
          d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
          fill="#0F0F0F"
        />
      </svg>
    </a>
  );
};

const LinkedIn = ({ url }) => {
  return (
    <a className="cursor-pointer" target="_blank" href={url}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="30px"
        height="30px"
      >
        {" "}
        <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
      </svg>
    </a>
  );
};

const Youtube = ({ url }) => {
  return (
    <a className="cursor-pointer " target="_blank" href={url}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="30px"
        height="30px"
      >
        <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z" />
      </svg>
    </a>
  );
};
