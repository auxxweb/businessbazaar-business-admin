import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { setBusinessData } from "../../api/slices/business";

const Judges = () => {
  const dispatch = useDispatch();
  const businessDetails = useSelector((state) => state.business.data);

  console.log(businessDetails)

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    _id: "",
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [imageCreatePreview, setImageCreatePreview] = useState("");

  const [updatedProduct, setUpdatedProduct] = useState({
    _id: "",
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (businessDetails) {
      setProducts(businessDetails.productSection || []);
    }
  }, [businessDetails]);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setImagePreview(product.image); // Initialize preview with current image
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setUpdatedProduct({ _id: "", title: "", description: "", price: "", image: null });
    setImagePreview("");
  };

  const handleCreateCloseModal = () => {
    setShowCreateModal(false);
    setNewProduct({ _id: "", title: "", description: "", price: "", image: null });
    setImageCreatePreview("");
  };

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false);
  };

  const preRequestFun = async (file, position) => {
    const url = `${process.env.REACT_APP_BE_API_KEY}/api/v1/s3url`;
    const requestBody = {
      files: [
        {
          position: position,
          file_type: file.type,
        },
      ],
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      const preReq = response.data.data[0];

      if (!preReq.url) {
        throw new Error("The URL is not defined in the response.");
      }
      await axios.put(preReq.url, file, {
        headers: { "Content-Type": file.type },
      });

      return preReq;
    } catch (error) {
      console.error("Error uploading file:", error.message || error);
      throw new Error("File upload failed");
    }
  };

  const handleInputChange = async (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const preReq = { accessLink: URL.createObjectURL(file) };
        if (preReq && preReq.accessLink) {
          setUpdatedProduct((prevProduct) => ({
            ...prevProduct,
            image: "preReq.accessLink",
          }));
          setImagePreview(URL.createObjectURL(file)); // Set image preview
        } else {
          console.error("Access link not found in response.");
        }
      }
    } else {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleCreateInputChange = async (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const preReq = { accessLink: URL.createObjectURL(file) };
          let accessLink = "";
          if (preReq && preReq.accessLink) {
            accessLink = preReq.accessLink;
            setNewProduct((prevProduct) => ({
              ...prevProduct,
              image: "accessLink",
            }));
          } else {
            console.error("Access link not found in response.");
          }
        };
        reader.readAsDataURL(file);

        // Image preview
        setImageCreatePreview(URL.createObjectURL(file));
      }
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = (event) => {

    const index = products.findIndex((product)=>(
      product._id  == updatedProduct._id
    ))
    products[index] = updatedProduct;
    dispatch(setBusinessData(businessDetails));
  
    handleCloseModal();
  };
  
    

  const handleDeleteProduct = () => {
    setProducts((prevBusinessData) => {
      return {
        ...prevBusinessData,
        productSection: prevBusinessData.productSection.filter(
          (product) => product._id !== selectedProduct._id
        ),
      };
    });
    handleDeleteCloseModal();
  };

  return (
    <>
      <div className="flex rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-700">Products</h2>
        <div className="ml-auto flex items-center space-x-4">
          <span className="flex items-center">
            <span
              className="bg-[#0EB599] hover:bg-[#068A55] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
              onClick={handleShowCreateModal}
            >
              Add Product
            </span>
          </span>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal show={showCreateModal} onHide={handleCreateCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newProduct.title}
                onChange={handleCreateInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleCreateInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleCreateInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleCreateInputChange}
              />
              {imageCreatePreview && (
                <img
                  src={imageCreatePreview}
                  alt="Image Preview"
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
          <Button variant="dark" onClick={handleCreateCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      <table className="min-w-full table-auto mt-6">
        <thead className="bg-white border-gray-400 border">
          <tr>
            <th className="px-4 py-4 text-left border-r border-gray-400">Sl No</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">Image</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">Title</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">ID</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} className="border-b">
              <td className="px-4 py-4">{index + 1}</td>
              <td className="px-4 py-4">
                <img
                  src={product.image || "default-image.png"}
                  alt="Product"
                  className="w-12 h-12 object-cover"
                />
              </td>
              <td className="px-4 py-4">{product.title}</td>
              <td className="px-4 py-4">{product._id}</td>
              <td className="px-4 py-4">
                <Button
                  variant="info"
                  onClick={() => handleShowModal(product)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={updatedProduct.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
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
          <Button variant="dark" onClick={handleCloseModal}>
            Close
          </Button>
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
        <Modal.Body>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Judges;
