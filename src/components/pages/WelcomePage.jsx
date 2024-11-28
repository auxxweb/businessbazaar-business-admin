import { useState, useEffect } from "react";
import useBusiness from "../../api/useBusiness";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import { toast } from "sonner";
import FullPageLoader from "../FullPageLoader/FullPageLoader";
import { Button, Modal } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropper.utils";

export default function WelcomePage() {
  const [modalState, setModalState] = useState({
    showEdit: false,
    showCreate: false,
    showDelete: false,
    showCrop: false,
  });
  const [currentImage, setCurrentImage] = useState({
    index: null,
    image: null,
    preview: "",
    file: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleModalState = (type, state) => {
    setModalState((prev) => ({ ...prev, [type]: state }));
  };

  const [businessData, setBusinessData] = useState({
    title: "",
    description: "",
    coverImage: "",
  });

  const { businesses, loading, getBusiness, updateBusiness } = useBusiness();
  const { imageLoading, uploadImage } = useImageUpload();

  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness();
    };

    fetchBusiness();
  }, []);

  useEffect(() => {
    if (businesses) {
      setBusinessData({
        title: businesses?.welcomePart?.title,
        description: businesses?.welcomePart?.description,
        coverImage: businesses?.welcomePart?.coverImage,
      });
      setCurrentImage({
        image: businesses?.welcomePart?.coverImage,
        preview: businesses?.welcomePart?.coverImage,
      });
    }
  }, [businesses]);

  const handleInputChange = async (e) => {
    setBusinessData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = async (e, isCreate = false) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage((prev) => ({
        ...prev,
        image: previewUrl,
        preview: previewUrl,
        file,
      }));
      handleModalState("showCrop", true);
    }
  };

  const handleLandingSubmit = async (e) => {
    e.preventDefault();

    try {
      let imgAccessUrl = businessData?.coverImage;
      if (currentImage?.file) {
        const data = await uploadImage(currentImage.file, "landingPage");
        imgAccessUrl = data?.accessLink;
      }
      // Prepare updated business data immutably
      const updatedData = {
        welcomePart: {
          ...businesses?.welcomePart,
          title: businessData?.title,
          description: businessData?.description,
          coverImage: imgAccessUrl,
        },
      };
      await updateBusiness(updatedData);
    } catch (error) {
      toast.error("Something went wrong , please try again!");
    }
  };

  return (
    <>
      <div className="flex flex-col max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        {(loading || imageLoading) && <FullPageLoader />}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Edit Welcome Page
        </h2>

        {/* Title Input */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={businessData?.title}
            name="title"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={businessData?.description}
            onChange={handleInputChange}
            rows="4"
            name="description"
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Image <span style={{ color: "grey" }}>(Ratio 5 : 7)</span>
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {currentImage.preview && (
            <img
              src={currentImage.preview}
              alt="Preview"
              className="w-1/2 mx-auto h-auto mt-4"
              style={{
                objectFit: "cover",
                display: "block",
                marginInline: "auto",
              }}
            />
          )}
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleLandingSubmit}
          className="mt-6 bg-[#105193] text-white py-2 px-4 rounded-lg hover:bg-[#107D93] transition"
        >
          Save Changes
        </button>
      </div>
      {/* Crop Modal */}
      <Modal
        show={modalState.showCrop}
        onHide={() => handleModalState("showCrop", false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container position-relative"
            style={{ height: "400px" }}
          >
            <Cropper
              image={currentImage.preview}
              crop={crop}
              zoom={zoom}
              aspect={5 / 7}
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
                preview: fileUrl,
                file: blob,
              }));
              handleModalState("showCrop", false);
            }}
          >
            Crop & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
