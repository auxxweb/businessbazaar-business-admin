import { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form, CloseButton } from 'react-bootstrap'
import useBusiness from '../../api/useBusiness'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import { toast } from 'sonner'
import Pagination from '../Pagination'
import getCroppedImg from '../../utils/cropper.utils'
import FullPageLoader from '../FullPageLoader/FullPageLoader'
import { TextField } from '@mui/material'
import { handleWordExceeded } from '../../utils/appUtils'
import { showToast } from '../../utils/notification'

const BasicServices = () => {
  const fileInputRef = useRef(null)

  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])

  const { imageLoading, uploadImage } = useImageUpload()
  const { businesses, loading, getBusiness, updateBusiness } = useBusiness()
  const [page, setPage] = useState(1)
  const [reFetch, SetReFetch] = useState(false)
  const limit = 10

  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness()
    }
    fetchBusiness()
  }, [])
  const resetCropper = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Clear the file input
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (businesses) {
          console.log(businesses)
          setServices(businesses?.service?.data)
          setServiceData({
            title: businesses?.service?.title ?? '',
            description: businesses?.service?.description ?? '',
          })
        }
      } catch (error) {
        console.error(
          'Error fetching business details:',
          error.message || error,
        )
      }
    }
    fetchData()
  }, [businesses])

  useEffect(() => {
    if (!services?.length) {
      setFilteredServices([])
      return
    }

    const startIndex = (page - 1) * limit
    const paginatedServices = services.slice(startIndex, startIndex + limit)

    setFilteredServices(paginatedServices)
  }, [services, page, limit])

  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    image: null,
  })

  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
  })

  const [updatedServices, setUpdatedServices] = useState({
    _id: '',
    title: '',
    description: '',
    image: null,
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)

  const [currentImage, setCurrentImage] = useState({ file: null, preview: null, image: null })

  const handleShowModal = (Servi) => {
    setSelectedService(Servi)
    setUpdatedServices({
      _id: Servi._id,
      title: Servi.title,
      description: Servi.description,
      image: Servi.image,
    })
    setCurrentImage({ image: Servi.image }) // Initialize preview with current image
    setShowModal(true)
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
    setCurrentImage({ image: null, preview: null, file: null })
  }

  const handlePageChange = (page) => {
    setPage(page)
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
  }

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false)
  }

  const handleShowCreateModal = () => setShowCreateModal(true)

  const handleInputChange = async (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        setUpdatedServices((prevServices) => ({
          ...prevServices,
          image: file, // Remove quotes here
        }))
        setCurrentImage((prev) => ({ ...prev, preview: URL.createObjectURL(file) }))
        setIsCropping(true)
      }
    } else {
      setUpdatedServices((prevServices) => ({
        ...prevServices,
        [name]: value,
      }))
    }
  }

  const setServiceInputChange = (e) => {
    setServiceData((prev) => ({
      ...prev, // Spread the previous state to retain other properties
      [e.target.name]: e.target.value, // Dynamically set the property from the input name and value
    }))
  }

  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        setCurrentImage((prev) => ({ ...prev, preview: URL.createObjectURL(file) }))
        setNewService((prevServices) => ({ ...prevServices, image: file }))
        setIsCropping(true)
      }
    } else {
      setNewService((prevServices) => ({ ...prevServices, [name]: value }))
    }
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault()
    console.log("updatedServices");

    if (!updatedServices?.title || !updatedServices?.description) {
      if (!updatedServices?.title) {
        showToast('Please enter title ')
        return
      }
      if (!updatedServices?.description) {
        showToast('Please enter description ')
        return
      }
    } else {
      if (handleWordExceeded(updatedServices?.title, 8)) {
        showToast('Title cannot exceed 8 words ')
        return
      }
      if (handleWordExceeded(updatedServices?.description, 50)) {
        showToast('Description cannot exceed 50 words')
        return
      }
      var imageAccessUrl = currentImage?.image
      if (currentImage?.file) {
        const data = await uploadImage(currentImage?.file, 'service')
        imageAccessUrl = data?.accessLink
        setUpdatedServices((prevService) => ({
          ...prevService,
          image: imageAccessUrl, // Remove quotes here
        }))
        updatedServices.image = imageAccessUrl
      }
      const updatedService = services.map((Servi) =>
        Servi._id === updatedServices._id ? updatedServices : Servi,
      )
      setServices(updatedService)
      const updatedData = {
        ...businesses,
        service: {
          ...businesses?.service,
          data: [...updatedService],
        },
      }
      console.log(updatedData, '')
      await updateBusiness(updatedData)
      setCurrentImage({ file: null, preview: null, image: null })
      console.log(updatedData, 'updatedData')
      handleCloseModal()
    }
  }

  const handleDeleteServices = async (e) => {
    e.preventDefault()
    try {
      const updatedServices = await services?.filter(
        (ser) => ser?._id !== selectedService?._id,
      )

      const updatedService = {
        ...businesses,
        service: {
          ...(businesses?.service ?? []),
          data: updatedServices,
        },
      }

      await updateBusiness(updatedService)
      setServices(updatedServices)
      handleDeleteCloseModal()
    } catch (error) {
      console.log(error, 'error')
    }
  }
  const handleCreateService = async (e) => {
    e.preventDefault()
    if (!newService?.title || !newService?.description) {
      if (!newService?.title) {
        showToast('Please enter title ')
      }
      if (!newService?.description) {
        showToast('Please enter description ')
      }

    } else {
      if (handleWordExceeded(newService?.title, 8)) {
        showToast('Title cannot exceed 8 words ')
        return
      }
      if (handleWordExceeded(newService?.description, 50)) {
        showToast('Description cannot exceed 50 words')
        return
      }
      try {
        let imgAccessUrl = null
        if (currentImage?.file) {
          const data = await uploadImage(currentImage?.file, 'service')
          imgAccessUrl = data?.accessLink
        }

        const newServices = businesses?.service?.data || []
        await newServices.push({
          ...newService,
          image: imgAccessUrl,
        })

        await newServices?.map((p) => {
          if (!p?._id || p._id === '') {
            delete p._id // Remove the _id property
            return p // Return the updated object
          } else {
            return p // Return the object unchanged
          }
        })
        // Prepare updated business data immutably
        const updatedData = {
          ...businesses,
          service: {
            ...(businesses?.service ?? []),
            data: newServices,
          },
        }
        await updateBusiness(updatedData)
        handleCreateCloseModal()
      } catch (error) {
        console.log(error, 'error ---------------------')
        toast.error('Something went wrong , please try again!')
      }
    }

  }

  const handleServiceMainSubmit = async (e) => {
    e.preventDefault()
    if (handleWordExceeded(serviceData?.title, 8)) {
      showToast('Title cannot exceed 8 words ')
      return
    }
    if (handleWordExceeded(serviceData?.description, 50)) {
      showToast('Description cannot exceed 50 words')
      return
    }
    e.preventDefault()
    const updatedData = {
      ...businesses,
      service: {
        title: serviceData?.title,
        description: serviceData?.description,
        data: services,
      },
    }

    updateBusiness(updatedData)
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
          <FullPageLoader />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Common Services
        </h2>
        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={handleShowCreateModal}
            className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
          >
            Add Service
          </button>
          <Modal show={showCreateModal} onHide={(() => {
            handleCreateCloseModal()
            setCurrentImage({ image: null, preview: null, file: null })
          })}>
            <Form onSubmit={handleCreateService}>
              <Modal.Header >
                <Modal.Title>Add Service</Modal.Title>
                <CloseButton onClick={(() => {
                  handleCreateCloseModal()
                  setCurrentImage({ image: null, preview: null, file: null })
                })} />
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="formTitle">
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Title (8 words)"
                    id="title"
                    name="title"
                    autoComplete="title"
                    value={newService?.title}
                    onChange={handleCreateInputChange}
                    error={handleWordExceeded(newService?.title, 8)}
                    helperText={handleWordExceeded(newService?.title, 8) ? "exceeded the limit" : ""}
                    className="my-4"
                  />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mt-3">
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={5}
                    label="Description (50 words)"
                    id="description"
                    name="description"
                    autoComplete="description"
                    value={newService?.description}
                    onChange={handleCreateInputChange}
                    error={handleWordExceeded(newService?.description, 50)}
                    helperText={handleWordExceeded(newService?.description, 50) ? "exceeded the limit" : ""}
                    className="mb-4"
                  />
                </Form.Group>
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>
                    Image <span style={{ color: 'grey' }}>(Ratio 16 : 8)</span>
                  </Form.Label>
                  <Form.Control
                    required
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleCreateInputChange}
                  />
                  {currentImage?.image && (
                    <img
                      src={currentImage?.image}
                      alt="Image Preview"
                      className="mt-3 w-1/2 h-auto mx-auto "
                      style={{
                        objectFit: 'cover',
                        marginInline: 'auto',
                      }}
                    />
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleCreateCloseModal}>
                  Close
                </Button>
                <Button type='submit' variant="success" >
                  Add Service
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="mx-auto max-w-screen-sm">
        <form
          onSubmit={handleServiceMainSubmit}
          className="bg-white p-4 border shadow-lg border-gray-400 rounded-md mb-6"
          style={{ maxWidth: '65rem', width: '100%' }}
        >
          <div className="flex flex-col space-y-4">
            {/* Title Input */}

            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              label="Title (8 words)"
              id="title"
              name="title"
              autoComplete="title"
              value={serviceData?.title}
              onChange={setServiceInputChange}
              error={handleWordExceeded(serviceData?.title, 8)}
              helperText={handleWordExceeded(serviceData?.title, 8) ? "exceeded the limit" : ""}
              className="mb-4"
            />


            {/* Description Input */}
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              label="Description (50 words)"
              id="description"
              name="description"
              autoComplete="title"
              value={serviceData?.description}
              onChange={setServiceInputChange}
              error={handleWordExceeded(serviceData?.description, 50)}
              helperText={handleWordExceeded(serviceData?.description, 50) ? "exceeded the limit" : ""}
              className="mb-4"
              rows={8}
            />
          </div>
          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-md shadow hover:bg-blue-600"
              style={{ backgroundColor: '#105193' }}
            >
              Update Details
            </button>
          </div>
        </form>
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
          {filteredServices?.map((splServices, index) => {
            if (splServices?.title || splServices?.description) {
              return (
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
              )
            }
          })}

          {/* Edit Service Modal */}
          <Modal show={showModal} onHide={(() => {
            handleCloseModal()
            setCurrentImage({ image: null, preview: null, file: null })
          })}>
            <Form onSubmit={handleSaveChanges}>
              <Modal.Header >
                <Modal.Title>Edit Special Services</Modal.Title>
                <CloseButton onClick={(() => {
                  handleCloseModal()
                  setCurrentImage({ image: null, preview: null, file: null })
                })} />
              </Modal.Header>
              <Modal.Body>

                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  label="Title (8 words)"
                  id="title"
                  name="title"
                  autoComplete="title"
                  value={updatedServices?.title}
                  onChange={handleInputChange}
                  error={handleWordExceeded(updatedServices?.title, 8)}
                  helperText={handleWordExceeded(updatedServices?.title, 8) ? "exceeded the limit" : ""}
                  className="mb-4"
                />
                {/* Description Input */}
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  label="Description (50 words)"
                  id="description"
                  name="description"
                  autoComplete="title"
                  value={updatedServices?.description}
                  onChange={handleInputChange}
                  error={handleWordExceeded(updatedServices?.description, 50)}
                  helperText={handleWordExceeded(updatedServices?.description, 50) ? "exceeded the limit" : ""}
                  className="mb-4"
                  rows={6}
                />
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>
                    Image<span style={{ color: 'grey' }}>(Ratio 16 : 8)</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                  />
                  {currentImage?.image && (
                    <img
                      src={currentImage?.image}
                      alt="Image Preview"
                      className="mt-3 w-1/2 h-auto mx-auto "
                      style={{
                        objectFit: 'cover',
                        marginInline: 'auto',
                      }}
                    />
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button type='submit' variant="success" >
                  Save changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Delete Service Confirmation Modal */}
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
      <Modal show={isCropping} onHide={(() => {
        resetCropper()
        setIsCropping(false)
      })}>
        <Modal.Header >
          <Modal.Title>Crop Image</Modal.Title>
          <CloseButton onClick={(() => {
            resetCropper()
            setIsCropping(false)
          })} />
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container position-relative"
            style={{ height: '400px' }} >
            <Cropper
              image={currentImage?.preview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 8} // Adjust aspect ratio as needed
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels)
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={async () => {
              const { blob, fileUrl } = await getCroppedImg(
                currentImage?.preview,
                croppedAreaPixels,
              )
              setCurrentImage((prev) => ({
                ...prev,
                preview: fileUrl,
                image: fileUrl,
                file: blob,
              }))
              setIsCropping(false)
            }}
          >
            Crop & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default BasicServices
