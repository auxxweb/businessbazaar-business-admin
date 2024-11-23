import { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import useBusiness from '../../api/useBusiness'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import { toast } from 'sonner'
import Pagination from '../Pagination'
import getCroppedImg from '../../utils/cropper.utils'
import FullPageLoader from '../FullPageLoader/FullPageLoader'

const SpecialServices = () => {
  const [businessData, setBusinessData] = useState([])

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (businesses) {
          setBusinessData(businesses)
          console.log(businesses)
          setServices(businesses?.specialServices?.data)
          setServiceData({
            title: businesses?.specialServices?.title ?? '',
            description: businesses?.specialServices?.description ?? '',
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
  const [imageCreatePreview, setImageCreatePreview] = useState('')
  const [imageCreateFile, setImageCreateFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
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
  const [imagePreview, setImagePreview] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)

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
    setImageCreatePreview('')
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
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
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
        setNewService((prevServices) => ({ ...prevServices, image: file }))
        setImageCreateFile(file)
        setImageCreatePreview(URL.createObjectURL(file))
        setIsCropping(true)
      }
    } else {
      setNewService((prevServices) => ({ ...prevServices, [name]: value }))
    }
  }
  const handleSaveChanges = async () => {
    if (!updatedServices?.title || !updatedServices?.description) {
      toast.warning('Please enter title and description', {
        position: 'top-right',
        duration: 2000,
        style: {
          backgroundColor: 'yellow', // Custom yellow color for warning
          color: '#FFFFFF', // Text color
        },
        dismissible: true,
      })
    } else {
      var imageAccessUrl = selectedService.image
      if (imageFile) {
        const data = await uploadImage(imageFile, 'SpecialServices')
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
        specialServices: {
          ...businesses?.specialServices,
          data: [...updatedService],
        },
      }
      await updateBusiness(updatedData)
      console.log(updatedData, 'updatedData')
      handleCloseModal()
    }
  }

  const handleDeleteServices = async () => {
    try {
      const updatedServices = await services?.filter(
        (ser) => ser?._id !== selectedService?._id,
      )

      const updatedService = {
        specialServices: {
          ...(businesses?.specialServices ?? []),
          data: updatedServices,
        },
      }

      await updateBusiness(updatedService)
      setServices(updatedServices)
      // setBusinessData(updatedData)

      handleDeleteCloseModal()
    } catch (error) {
      console.log(error, 'error')
    }
  }
  const handleCreateService = async () => {
    if (!newService?.title || !newService?.description) {
      toast.warning('Please enter title and description', {
        position: 'top-right',
        duration: 2000,
        style: {
          backgroundColor: 'yellow', // Custom yellow color for warning
          color: '#FFFFFF', // Text color
        },
        dismissible: true,
      })
    } else {
      try {
        let imgAccessUrl
        if (imageCreateFile) {
          const data = await uploadImage(imageCreateFile, 'SpecialServices')
          imgAccessUrl = data?.accessLink
        }

        const newServices = businesses?.specialServices?.data || []
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
          specialServices: {
            ...(businesses?.specialServices ?? []),
            data: newServices,
          },
        }
        await updateBusiness(updatedData)
        handleCreateCloseModal()
      } catch (error) {
        console.log(error, 'errorr ---------------------')
        toast.error('Something went wrong , please try again!')
      }
    }
    // setServices((prevServices) => {
    //   const updatedServices = Array.isArray(prevServices)
    //     ? [...prevServices, newService]
    //     : [newService];

    //   const updatedData = {
    //     specialServices: {
    //       ...businessData.specialServices,
    //       data: updatedServices,
    //     },
    //   };

    //   setBusinessData(updatedData);
    //   handleCloseModal();
    //   return updatedServices;
    // });
  }

  const handleServiceMainSubmit = async (e) => {
    e.preventDefault()
    const updatedData = {
      specialServices: {
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
          Special Services
        </h2>
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
              <Modal.Title>Add Service</Modal.Title>
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
                    Image <span style={{ color: 'grey' }}>(Ratio 4 : 3)</span>
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
                Add Service
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <div className="w-100 flex justify-center">
        <form
          onSubmit={handleServiceMainSubmit}
          className="bg-white p-4 border border-gray-400 rounded-md mb-6"
          style={{ maxWidth: '65rem', width: '100%' }}
        >
          <div className="flex flex-col space-y-4">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={serviceData?.title}
                onChange={setServiceInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter title"
              />
            </div>
            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                name="description"
                onChange={setServiceInputChange}
                value={serviceData?.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter description"
                // onChange={setProductInputChange}
              ></textarea>
            </div>
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
                  <Form.Label>
                    Image<span style={{ color: 'grey' }}>(Ratio 4 : 3)</span>
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
      <div className="m-auto flex justify-end mt-8">
        <Pagination
          totalItems={services?.length}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal show={isCropping} onHide={() => setIsCropping(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container position-relative"
            style={{ height: '400px' }}
          >
            <Cropper
              image={imagePreview || imageCreatePreview}
              crop={crop}
              zoom={zoom}
              aspect={4 / 5} // Adjust aspect ratio as needed
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
                imagePreview || imageCreatePreview,
                croppedAreaPixels,
              )
              // Convert the croppedImage blob to a URL for preview or upload
              imagePreview && setImagePreview(fileUrl)
              imageCreatePreview && setImageCreatePreview(fileUrl)
              imagePreview && setImageFile(blob)
              imageCreatePreview && setImageCreateFile(blob)
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

export default SpecialServices
