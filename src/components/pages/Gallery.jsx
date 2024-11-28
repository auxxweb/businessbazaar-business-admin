import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Button, Form, Modal } from "react-bootstrap";
import useBusiness from "../../api/useBusiness";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import getCroppedImg from "../../utils/cropper.utils";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

const Gallery = () => {
  const { businesses, getBusiness, updateBusiness ,loading} = useBusiness();
  const { uploadImage,imageLoading } = useImageUpload();

  const [gallery, setGallery] = useState([]);
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

  const handleSaveChanges = async () => {
    if (currentImage.file) {
      const data = await uploadImage(currentImage.file, "gallery");
      if (data?.accessLink) {
        const newGallery = [...gallery];
        newGallery[currentImage.index] = data.accessLink;
        await updateBusiness({ gallery: newGallery });
        setGallery(newGallery);
      }
      resetCurrentImage();
      handleModalState("showEdit", false);
    }
  };

  const handleDeleteGallery = async () => {
    const newGallery = gallery.filter((_, i) => i !== currentImage.index);
    await updateBusiness({ gallery: newGallery });
    setGallery(newGallery);
    resetCurrentImage();
    handleModalState("showDelete", false);
  };

  const handleCreateProduct = async () => {
    if (currentImage.file) {
      const data = await uploadImage(currentImage.file, "gallery");
      if (data?.accessLink) {
        const newGallery = [...gallery, data.accessLink];
        await updateBusiness({ gallery: newGallery });
        setGallery(newGallery);
      }
      resetCurrentImage();
      handleModalState("showCreate", false);
    }
  };

  const resetCurrentImage = () => {
    setCurrentImage({
      index: null,
      image: null,
      preview: "",
      file: null,
    });
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness();
    };
    fetchBusiness();
  }, []);

  useEffect(() => {
    setGallery(businesses?.gallery || []);
  }, [businesses?.gallery]);

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
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl m-0 p-0 font-semibold text-gray-700">Gallery</h2>
          <div className="ml-auto flex items-center space-x-4">
            <span className="flex items-center">
              <button
                className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
                onClick={() => handleModalState("showCreate", true)}
              >
                Add Gallery
              </button>
            </span>
          </div>
        </div>
        <div className="row">
          {imageLoading&&(
            <FullPageLoader/>
          )}
          {gallery.map((item, index) => (
            <div className="col-md-3 p-2" key={index}>
              <div className="w-fit h-full border relative rounded-md mx-auto hover:shadow-xl duration-300">
                <img src={item} alt="" className="w-48 h-auto mx-auto" />
                <div className="absolute left-0 bottom-0 flex justify-between w-full hover:flex py-2">
                  <button
                    className="rounded shadow text-xs"
                    onClick={() => {
                      setCurrentImage({ index, image: item, preview: item });
                      handleModalState("showEdit", true);
                    }}
                  >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      className="w-5 h-5 cursor-pointer ms-1"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentImage({ index, image: item });
                      handleModalState("showDelete", true);
                    }}
                  >
                    <img
                      alt="Delete"
                      src="/icons/delete.svg"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        show={modalState.showCreate || modalState.showEdit}
        onHide={() => {
          handleModalState("showCreate", false);
          handleModalState("showEdit", false);
          resetCurrentImage();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalState.showCreate ? "Add Gallery" : "Edit Gallery"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>
                Image <span style={{ color: "grey" }}>(Ratio 4 : 5)</span>
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {currentImage.preview && (
                <img
                  src={currentImage.preview}
                  alt="Preview"
                   className="mt-3 w-1/2 h-auto mx-auto "
                  style={{
                    objectFit: "cover",
                    display: "block",
                    marginInline: "auto",
                  }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={
              modalState.showCreate ? handleCreateProduct : handleSaveChanges
            }
          >
            {modalState.showCreate ? "Submit" : "Save changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={modalState.showDelete}
        onHide={() => handleModalState("showDelete", false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark"
            onClick={() => handleModalState("showDelete", false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteGallery}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

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
              aspect={4 / 5}
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
};

export default Gallery;
