import { useState, useEffect, useRef } from "react";
import useBusiness from "../../api/useBusiness";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import { toast } from "sonner";
import FullPageLoader from "../FullPageLoader/FullPageLoader";
import { Button, CloseButton, Modal } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropper.utils";
import { TextField } from "@mui/material";
import { handleWordExceeded } from "../../utils/appUtils";

export default function WelcomePage() {
  const fileInputRef = useRef(null);
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

  const resetCropper = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

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
        preview: previewUrl,
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
        <TextField
            variant="outlined"
            required
            fullWidth
            label="Welcome Page Title (8 words)"
            id="title"
            name="title"
            autoComplete="title"
            value={businessData?.title}
            onChange={handleInputChange}
            error={handleWordExceeded(businessData?.title, 8)}
            helperText={handleWordExceeded(businessData?.title, 8) ? "exceeded the limit" : ""}
            className="my-4"
             />

        {/* Description Input */}
        <TextField
            variant="outlined"
            required
            fullWidth
            multiline
            rows={8}
            label="Welcome Page Description (50 words)"
            id="description"
            name="description"
            autoComplete="description"
            value={businessData?.description}
            onChange={handleInputChange}
            error={handleWordExceeded(businessData?.description, 50)}
            helperText={handleWordExceeded(businessData?.description, 50) ? "exceeded the limit" : ""}
            className="mb-4"
             />

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
          {currentImage.image && (
            <img
              src={currentImage.image}
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
        onHide={(() =>{ resetCropper()
           handleModalState("showCrop", false)})}
      >
        <Modal.Header >
          <Modal.Title>Crop Image</Modal.Title>
          <CloseButton onClick={(() =>{ resetCropper()
           handleModalState("showCrop", false)})}/>
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
                image: fileUrl,
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
