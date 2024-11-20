import { useCallback, useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Form } from 'react-bootstrap'
import axios from 'axios'
import { setBusinessData } from '../../api/slices/business'
import { useNavigate } from 'react-router-dom'
import { getApi } from '../../api/api'
import Pagination from '../Pagination'
import getCroppedImg from '../../utils/cropper.utils'
import useBusiness from '../../api/useBusiness'
import { useDebouncedCallback } from 'use-debounce';
import FullPageLoader from '../FullPageLoader/FullPageLoader';

const BasicServices = () => {
  const { updateBusiness,loading } = useBusiness()
  const dispatch = useDispatch()
  const [businessData, setBusinessData] = useState([])

  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessDetails = await getApi(
          `api/v1/business/profile`,
          true,
          dispatch,
          navigate,
        )

        setBusinessData(businessDetails.data)

        setServices(businessDetails?.data?.service)
      } catch (error) {
        console.error(
          'Error fetching business details:',
          error.message || error,
        )
      }
    }
    fetchData()
  }, [dispatch, navigate])

  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newService, setNewService] = useState({
    _id: '',
    title: '',
    description: '',
    image: null,
  })
  const [imageCreatePreview, setImageCreatePreview] = useState('')

  const [updatedServices, setUpdatedServices] = useState({
    _id: '',
    title: '',
    description: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [page, setPage] = useState(1)
  const [reFetch, SetReFetch] = useState(false)
  // Cropper state
  const [showCropperModal, setShowCropperModal] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [imageFileToCrop, setImageFileToCrop] = useState(null)
  const limit = 1
  useEffect(() => {
    if (businessData) {
      setServices(businessData.service || [])
    }
  }, [businessData])


  useEffect(() => {
    if (!services?.length) {
      setFilteredServices([])
      return
    }

    const startIndex = (page - 1) * limit
    const paginatedServices = services.slice(startIndex, startIndex + limit)

    setFilteredServices(paginatedServices)
  }, [services, page, limit])

  const handleShowModal = (Servi) => {
    setSelectedService(Servi)
    setUpdatedServices({
      _id: Servi._id,
      title: Servi.title,
      description: Servi.description,
      image: Servi.image,
    })
    setImagePreview(Servi.image) // Initialize preview with current image
    setShowModal(true)
  }

  const handlePageChange = (page) => {
    setPage(page)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedService(null)
    setUpdatedServices({
      _id: '',
      title: '',
      description: '',
      price: '',
      image: null,
    })
    setImagePreview('')
  }

  const handleCreateCloseModal = () => {
    setShowCreateModal(false)
    setNewService({
      _id: '',
      title: '',
      description: '',
      price: '',
      image: null,
    })
    setImageCreatePreview('')
  }

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false)
  }

  const preRequestFun = async (file, position) => {
    const url = `${process.env.REACT_APP_BE_API_KEY}/api/v1/s3url`
    const requestBody = {
      files: [
        {
          position: position,
          file_type: file.type,
        },
      ],
    }

    try {
      const response = await axios.post(url, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      })
      const preReq = response.data.data[0]

      if (!preReq.url) {
        throw new Error('The URL is not defined in the response.')
      }
      await axios.put(preReq.url, file, {
        headers: { 'Content-Type': file.type },
      })

      return preReq
    } catch (error) {
      console.error('Error uploading file:', error.message || error)
      throw new Error('File upload failed')
    }
  }

  const handleShowCreateModal = () => setShowCreateModal(true)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropImage = async () => {
    try {
      const { blob, fileUrl } = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (blob) {
        // Update the state with the cropped image URL
        const preReq = await preRequestFun(blob, imageFileToCrop?.name)
        if (showCreateModal) {
          setNewService((prevServices) => ({
            ...prevServices,
            image: preReq?.accessLink,
          }))
          setImageCreatePreview(fileUrl)
        } else if (showModal) {
          setUpdatedServices((prevServices) => ({
            ...prevServices,
            image: preReq?.accessLink,
          }))
          setImagePreview(fileUrl)
        }
      }
      setShowCropperModal(false)
    } catch (error) {
      console.error('Error cropping the image:', error)
    }
  }

  const handleInputChange = async (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          setImageSrc(reader.result)
          setImageFileToCrop(file)
          setShowCropperModal(true)
        }
      }
    } else {
      setUpdatedServices((prevServices) => ({
        ...prevServices,
        [name]: value,
      }))
    }
  }

  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          setImageSrc(reader.result)
          setImageFileToCrop(file)
          setShowCropperModal(true)
        }
      }
    } else {
      setNewService((prevServices) => ({ ...prevServices, [name]: value }))
    }
  }
  const handleSaveChanges = async () => {
    const updatedService = services.map((Servi) =>
      Servi._id === updatedServices._id ? updatedServices : Servi,
    )
    console.log(updatedServices)
    const updatedData = { ...businessData, service: updatedService }
    await updateBusiness({ service: updatedService })
    setBusinessData(updatedData)
    setServices(updatedService)
    handleCloseModal()
  }

  const handleDeleteServices = async () => {
    setServices((prevServices) =>
      prevServices.filter((Servi) => Servi._id !== selectedService._id),
    )

    const updatedData = {
      ...businessData,
      service: services.filter((Servi) => Servi._id !== selectedService._id),
    }

    setBusinessData(updatedData)
    await updateBusiness({
      service: services.filter((Servi) => Servi._id !== selectedService._id),
    })
    handleDeleteCloseModal()
  }

  const handleCreateService = async () => {
    const cleanNewService = { ...newService }

    // Remove `_id` if it's invalid
    if (!cleanNewService._id) {
      delete cleanNewService._id
    }

    const updatedServices = Array.isArray(services)
      ? [...services, cleanNewService]
      : [cleanNewService]

    const updatedData = { ...businessData, service: updatedServices }
    await updateBusiness({ service: updatedServices })
    setBusinessData(updatedData)
    handleCreateCloseModal()
    setServices(updatedServices) // Update services only at the end
  }


  const handleSearchChange = useDebouncedCallback((value) => {
    if (!value?.trim()) {
      setFilteredServices(services)
      return
    } // Exit if value is empty or only whitespace

    const filteredServices = services?.filter(
      (ser) =>
        ser?.title?.toLowerCase().includes(value.toLowerCase()) ||
        ser?.description?.toLowerCase().includes(value.toLowerCase()),
    )

    // Assuming you have a state or method to handle filtered results
    setFilteredServices(filteredServices)
  }, 500)


  if (loading) {
    return (
      <div className="h-100vh text-center ">
        <div className="row h-100 justify-content-center align-items-center">
          <FullPageLoader/>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex rounded-lg p-4">
        {/* Cropper Modal */}
        <Modal
          show={showCropperModal}
          onHide={() => setShowCropperModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Crop Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="crop-container position-relative"
              style={{ height: '400px' }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 8} // Adjust the aspect ratio as needed
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCropperModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCropImage}>
              Crop Image
            </Button>
          </Modal.Footer>
        </Modal>

        <h2 className="text-2xl font-semibold text-gray-700">Services</h2>
        <div className="ml-auto flex items-center space-x-4">
          {' '}
          <button
            onClick={handleShowCreateModal}
            className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
          >
            Add Service
          </button>
          <Modal show={showCreateModal} onHide={handleCreateCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Services</Modal.Title>
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
                  <Form.Label>
                    Image <span>(Ratio 16 : 8)</span>
                  </Form.Label>
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
                       className="mt-3 w-1/2 h-auto mx-auto "
                      style={{
                        objectFit: 'cover',
                        marginInline: 'auto',
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
              placeholder="Search by title,description"
              onChange={(e) => {
                handleSearchChange(e.target.value)
              }}
            />
          </span>
          {/* <span className="flex items-center">
            <span className="cursor-pointer bg-[#105193] hover:bg-[#107D93] text-white p-2 lg:w-[100px] text-center rounded-3xl">
              Search
            </span>
          </span> */}
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
            {/* <th className="px-4 py-4 text-left border-r border-gray-400">ID</th> */}
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Description
            </th>
            <th className="px-4 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-50 border-[#969696]">
          {filteredServices?.map((splServices, index) => (
            <tr
              className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
              key={index}
            >
              <td className="px-4 py-2 border-r border-gray-400">
                {index + 1}
              </td>

              <td className="px-4 py-2 border-r border-gray-400">
                <img
                  alt="img"
                  src={splServices?.image ?? 't'}
                  className="w-14 h-14 rounded-full mr-2 mt-2"
                />
              </td>
              <td className="px-4 py-2 border-r border-gray-400">
                {splServices?.title}
              </td>
              {/* <td className="px-4 py-2 border-r border-gray-400">
                {splServices?._id}
              </td> */}
              <td className="px-4 py-2 border-r border-gray-400">
                <div className="flex -space-x-2">
                  {splServices?.description}
                </div>
              </td>
              <td className="px-4 py-2 border-r border-gray-400">
                <button
                  onClick={(e) => {
                    handleShowModal(splServices)
                  }}
                >
                  <img
                    alt="pics"
                    src="/icons/edit.svg"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true)
                    setSelectedService(splServices)
                  }}
                >
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
              <Modal.Title>Edit Services</Modal.Title>
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
                  <Form.Label>
                    Image<span>(Ratio 16 : 8)</span>
                  </Form.Label>
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
                       className="mt-3 w-1/2 h-auto mx-auto "
                      style={{ 
                        objectFit: 'cover',
                        marginInline: 'auto',
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
            <Modal.Body>
              Are you sure you want to delete this Service?
            </Modal.Body>
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
      <div className="m-auto flex justify-end mt-8">
        <Pagination
          totalItems={services?.length}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default BasicServices
