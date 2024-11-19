import { useEffect, useState } from "react";
import useBusiness from "../../api/useBusiness";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import { Button, Form, Modal } from "react-bootstrap";

const Gallery = () => {
  const { businesses, getBusiness, updateBusiness } = useBusiness();
  const { uploadImage } = useImageUpload();

  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    index: null,
    image: null,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [imgPreview, setImgPreview] = useState(false);
  const [imageCreatePreview, setImageCreatePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [updatedImg, setUpdatedImg] = useState({
    index: null,
    image: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowModal = (index, imgUrl) => {
    setSelectedImage(imgUrl);
    setUpdatedImg({
      index,
      image: imgUrl,
    });
    setImgPreview(imgUrl); // Initialize preview with current image
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage({ index: null, image: null });
    setUpdatedImg({ index: null, image: null });
    setImgPreview("");
  };

  const handleCreateCloseModal = () => {
    setShowCreateModal(false);
    setImageCreatePreview("");
  };

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleInputChange = async (e) => {
    const { type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImgPreview(URL.createObjectURL(file));
      } else {
        console.error("Access link not found in response.");
      }
    }
  };

  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageCreatePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSaveChanges = async () => {
    let accessLink = null;
    if (imageFile) {
      const data = await uploadImage(imageFile, "gallery");
      accessLink = data?.accessLink;
    }

    const newGallery = [...gallery];
    newGallery[updatedImg?.index] = accessLink;

    const updateData = { gallery: newGallery };
    console.log(updateData, "updated-data");

    await updateBusiness(updateData);
    setImageFile(null);
    handleCloseModal();
  };

  const handleDeleteGallery = async () => {
    let newGallery;
    setGallery((prevGallery) => {
      newGallery = [...prevGallery];
      newGallery.splice(selectedImage?.index, 1);
      return newGallery;
    });

    const updatedData = { gallery: newGallery };

    console.log(updatedData);

    await updateBusiness(updatedData);
    setImageFile(null);

    handleDeleteCloseModal();
  };

  const handleCreateProduct = async () => {
    let accessLink = null;
    if (imageFile) {
      const data = await uploadImage(imageFile, "gallery");
      console.log(data?.accessLink, "data-accessLink");
      accessLink = data?.accessLink;
    }

    const newGallery = [...gallery];
    newGallery.push(accessLink);

    const updateData = { gallery: newGallery };
    console.log(updateData, "updated-data");

    await updateBusiness(updateData);

    handleCreateCloseModal();
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

  return (
    <>
      <div className="container">
        <div className="flex rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-700">Gallery</h2>
          <div className="ml-auto flex items-center space-x-4">
            <span className="flex items-center">
              <span
                className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
                onClick={handleShowCreateModal}
              >
                Add Gallery
              </span>
            </span>
          </div>
        </div>
        <div className="row ">
          {gallery?.map((item, index) => (
            <div className="col-md-3 p-2  ">
              <div className=" w-fit h-full border relative rounded-md mx-auto hover:shadow-xl duration-300 ">
                <img src={item} alt="" className=" w-48 h-auto mx-auto" />
                <div className="absolute left-0 bottom-0 flex justify-between w-full  hover:flex  py-2 ">
                  <button
                    className=" rounded shadow  text-xs "
                    onClick={() => handleShowModal(index, item)}
                  >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      className="w-5 h-5 cursor-pointer ms-1"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage({ image: item, index });
                      setShowDeleteModal(true);
                    }}
                  >
                    <img
                      alt="pics"
                      src="/icons/delete.svg"
                      className="w-6 h-6 rounded-full mr-2 fill-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Gallery Modal */}
      <Modal
        show={showCreateModal}
        onHide={handleCreateCloseModal}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            width: "500px",
          }}
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: "1px solid #eaeaea",
              padding: "16px 24px",
            }}
          >
            <Modal.Title style={{ fontWeight: "500", fontSize: "1.25rem" }}>
              Add Gallery
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "24px",
            }}
          >
            <Form>
              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label style={{ fontWeight: "500" }}>
                  Image<span>(Ratio 4 : 5)</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  required
                  accept="image/*"
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: "8px",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                {imageCreatePreview && (
                  <img
                    src={imageCreatePreview}
                    alt="Preview"
                    className="mt-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      display: "block",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      margin: "10px auto",
                    }}
                  />
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: "1px solid #eaeaea",
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <Button
              onClick={handleCreateProduct}
              style={{
                fontWeight: "500",
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Edit Gallery Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Gallery</Modal.Title>
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
                onChange={handleInputChange}
              />
              {imgPreview && (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="mt-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginInline: "auto",
                  }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Product Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteGallery}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Gallery;
