
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { setBusinessData } from "../../api/slices/business";

const Participants = () => {
  const dispatch = useDispatch();
  const businessData = useSelector((state) => state.business.data);

  console.log(businessData)

  const specialServices = businessData.specialServices

  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newService, setNewService] = useState({
    _id: "",
    title: "",
    description: "",
    image: null,
  });
  const [imageCreatePreview, setImageCreatePreview] = useState("");

  const [updatedServices, setUpdatedServices] = useState({
    _id: "",
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (businessData) {
      setServices(businessData.specialServices || []);
    }
  }, [businessData]);

  const handleShowModal = (Servi) => {
    setSelectedService(Servi);
    setUpdatedServices({
      _id: Servi._id,
      title: Servi.title,
      description: Servi.description,
      image: Servi.image,
    });
    setImagePreview(Servi.image); // Initialize preview with current image
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setUpdatedServices({
      _id: "",
      title: "",
      description: "",
      price: "",
      image: null,
    });
    setImagePreview("");
  };

  const handleCreateCloseModal = () => {
    setShowCreateModal(false);
    setNewService({
      _id: "",
      title: "",
      description: "",
      price: "",
      image: null,
    });
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

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleInputChange = async (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const preReq = await preRequestFun(file, name);
        if (preReq && preReq.accessLink) {
          setUpdatedServices(prevServices => ({
            ...prevServices,
            image: preReq.accessLink, // Remove quotes here
          }));
          setImagePreview(URL.createObjectURL(file)); 
        } else {
          console.error("Access link not found in response.");
        }
      }
    } else {
      setUpdatedServices(prevServices => ({ ...prevServices, [name]: value }));
    }
  };
  
  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        const preReq = await preRequestFun(file, name);
        if (preReq && preReq.accessLink) {
          setNewService(prevServices => ({ ...prevServices, image: preReq.accessLink }));
          setImageCreatePreview(URL.createObjectURL(file));
      
        }
      }
    } else {
      setNewService(prevServices => ({ ...prevServices, [name]: value }));
    }
  };
  const handleSaveChanges = () => {
    const updatedService = services.map(Servi =>
      Servi._id === updatedServices._id ? updatedServices : Servi
    );
    console.log(updatedServices)
    const updatedData = { ...businessData, specialServices: updatedService };
    dispatch(setBusinessData(updatedData));
    handleCloseModal();
  };

  const handleDeleteServices = () => {
    setServices((prevServices) => 
      prevServices.filter((Servi) => Servi._id !== selectedService._id)
    );
  
    const updatedData = { 
      ...businessData, 
      specialServices: services.filter((Servi) => Servi._id !== selectedService._id) 
    };
  
    dispatch(setBusinessData(updatedData));
  
    handleDeleteCloseModal();
  };
  
  const handleCreateService = () => {
    setServices((prevServices) => {
      const updatedServices = Array.isArray(prevServices) ? [...prevServices, newService] : [newService];
  
      const updatedData = { ...businessData, specialServices: updatedServices };
  
      dispatch(setBusinessData(updatedData));
      handleCloseModal();
      return updatedServices;   
    });
  };
  




  return (
    <>
      <div className="flex rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-700">Special Services</h2>
        <div className="ml-auto flex items-center space-x-4">
          {" "}
          <button
              onClick={handleShowCreateModal}
              className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
            >
              Add Service
            </button>
          <Modal show={showCreateModal} onHide={handleCreateCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Servi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newService.title}
                onChange={handleCreateInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newService.description}
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
          <Button variant="success" onClick={handleCreateService}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
      </div>
      <div className="flex rounded-lg p-4 pr-0 pt-0">
      
        <div className="ml-auto lg:mr-4 flex items-center space-x-4 justify-end pt-3">
          {/* Parent div for span elements */}
          <span className="flex items-center justify-center">
            <input
              className="p-2 lg:w-[250px] w-full appearance-none bg-white border border-gray-400 rounded-3xl"
              placeholder="Search by name"
              // onChange={(e) => {
              //   handleSearchChange(e.target.value);
              // }}
            />
          </span>
          <span className="flex items-center">
            <span className="cursor-pointer bg-[#105193] hover:bg-[#107D93] text-white p-2 lg:w-[100px] text-center rounded-3xl">
              Search
            </span>
          </span>
        </div>
      </div>
      <table className="min-w-full table-auto mt-6">
        <thead className="bg-white border-gray-400 border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px]">
          <tr>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Sl No
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Image
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Title
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">ID</th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Description
            </th>
            <th className="px-4 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-50 border-[#969696]">

            {services?.map((splServices, index) => (
              <tr
                className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
                key={index}
              >
                <td className="px-4 py-2 border-r border-gray-400">
                  {index + 1}
                </td>
             
                <td
                  className="px-4 py-2 border-r border-gray-400"
                >
                  <img
                    alt="img"
                    src={splServices?.image ?? "t"}
                    className="w-14 h-14 rounded-full mr-2 mt-2"
                  />
                </td>
                <td
                  className="px-4 py-2 border-r border-gray-400"
                >
                  {splServices?.title}
                </td>
                <td
                  className="px-4 py-2 border-r border-gray-400"
                >
                  {splServices?._id}
                </td>
                <td
                  
                  className="px-4 py-2 border-r border-gray-400"
                >
                  <div className="flex -space-x-2">{splServices?.description}</div>
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                  <button onClick={(e) => {handleShowModal(splServices)}}>
                    <img
                      alt="pics"
                      src="/icons/edit.svg"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  </button>
                  <button onClick={() => {setShowDeleteModal(true);setSelectedService(splServices)}}>
                    <img
                      alt="pics"
                      src="/icons/delete.svg"
                      className="w-6 h-6 rounded-full mr-2 fill-red-500"
                    />
                  </button>
                </td>
              </tr>
              
            ))}

 {/* Edit Servi Modal */}
 <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Special Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={updatedServices.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={updatedServices.description}
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

      {/* Delete Servi Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Servi?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteServices}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


        </tbody>
      </table>
    </>
  );
};

export default Participants;
