import { useEffect, useRef, useState } from 'react'
import { Button, Modal, Form, CloseButton } from 'react-bootstrap'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import useBusiness from '../../api/useBusiness'
import Pagination from "../Pagination";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropper.utils';
import FullPageLoader from '../FullPageLoader/FullPageLoader';
import { TextField } from '@mui/material';
import { handleWordExceeded } from '../../utils/appUtils';
import { toast } from 'sonner';
import { showToast } from '../../utils/notification';


const Judges = () => {
  const fileInputRef = useRef(null);
  const { imageLoading, uploadImage } = useImageUpload()
  const {
    businesses,
    loading,
    getBusiness,
    updateBusiness,
    addProduct,
  } = useBusiness()
  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness()
    }
    fetchBusiness()
  }, [])
  const resetCropper = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };
  const [products, setProducts] = useState([])
  const [productData, setProductData] = useState({
    title: '',
    description: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: null,
    image: null,
  })
  const [imageCreatePreview, setImageCreatePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [updatedProduct, setUpdatedProduct] = useState({
    _id: '',
    title: '',
    description: '',
    price: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [validated, setValidated] = useState(false);
  const [page, setPage] = useState(1)
  const limit = 10
  const [modalState, setModalState] = useState({
    showEdit: false,
    showCreate: false,
    showDelete: false,
    showCrop: false,
  })
  const [currentImage, setCurrentImage] = useState({
    index: null,
    image: null,
    preview: '',
    file: null,
  })
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const setProductInputChange = (e) => {
    setProductData((prev) => ({
      ...prev, // Spread the previous state to retain other properties
      [e.target.name]: e.target.value, // Dynamically set the property from the input name and value
    }))
  }

  const handleProductMainSubmit = async (e) => {
    e.preventDefault()

    if (!productData.title || !productData.description) {
      toast.warning('Please enter title and description', {
        theme: "colored",
        position: "top-right",
        style: {
          backgroundColor: "orange",
          color: "#FFFFFF",
          height: "60px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }
      })
    }

    if (handleWordExceeded(productData?.title, 8)) {
      showToast('Title cannot exceed 8 words ')
      return
    }
    if (handleWordExceeded(productData?.description, 50)) {
      showToast('Description cannot exceed 50 words')
      return
    }

    const updatedData = {
      ...businesses,
      productSection: {
        title: productData?.title,
        description: productData?.description,
        data: products,
      },
    }

    await updateBusiness(updatedData)
  }

  const handleModalState = (type, state) => {
    setModalState((prev) => ({ ...prev, [type]: state }))
  }
  useEffect(() => {
    setProducts(businesses?.productSection?.data)
    setProductData({
      title: businesses?.productSection?.title ?? '',
      description: businesses?.productSection?.description ?? '',
    })
  }, [businesses])

  const handleShowModal = (product) => {
    console.log(product);

    setSelectedProduct(product)
    setUpdatedProduct({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
    })
    setCurrentImage({ preview: product.image, image: product.image }) // Initialize preview with current image
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setUpdatedProduct({
      _id: '',
      title: '',
      description: '',
      price: '',
      image: null,
    })
    setCurrentImage({ image: null, preview: null })
    setImagePreview('')
  }

  const handleCreateCloseModal = () => {
    setNewProduct({
      _id: '',
      title: '',
      description: '',
      price: '',
      image: null,
    })
    setCurrentImage({
      index: null,
      image: null,
      preview: '',
      file: null,
    })
    setShowCreateModal(false)
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
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        console.error('Access link not found in response.')
      }
    } else {
      setUpdatedProduct((prevProduct) => ({ ...prevProduct, [name]: value }))
    }
  }

  const handleFileChange = async (e, isCreate = false) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setCurrentImage((prev) => ({
        ...prev,
        preview: previewUrl,
      }))
      handleModalState('showCrop', true)
    }
  }

  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        setImageFile(file)
        setImageCreatePreview(URL.createObjectURL(file))
      }
    } else {
      setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }))
    }
  }
  const handleSaveChanges = async (e) => {
    e.preventDefault()

    if (handleWordExceeded(updatedProduct?.title, 8)) {
      showToast('Title cannot exceed 8 words ')
      return
    }
    if (handleWordExceeded(updatedProduct?.description, 50)) {
      showToast('Description cannot exceed 50 words')
      return
    }

    let accessLink = selectedProduct.image
    if (currentImage?.file) {
      const data = await uploadImage(currentImage?.file, 'products')
      accessLink = data?.accessLink
    }
    const updatedProducts = products?.map((product) =>
      product._id === updatedProduct._id
        ? { ...updatedProduct, image: accessLink }
        : product,
    )
    const updateData = {
      ...businesses,
      productSection: {
        title: productData?.title,
        description: productData?.description,
        data: updatedProducts,
      },
    }
    console.log(updateData, 'updated-data')

    await updateBusiness(updateData)
    setCurrentImage({ image: null, preview: null })
    handleCloseModal()
  }

  const handleDeleteProduct = async (e) => {
    e.preventDefault()
    // setProducts((prevProducts) =>
    //   prevProducts.filter((product) => product._id !== selectedProduct._id),
    // )

    try {
      const updatedProducts = await products?.filter(
        (prod) => prod?._id !== selectedProduct?._id,
      )

      const updatedData = {
        ...businesses,
        productSection: {
          title: productData?.title,
          description: productData?.description,
          data: updatedProducts,
        },
      }

      await updateBusiness(updatedData)

      setCurrentImage({ image: null, preview: null })
    } catch (error) {
      console.log(error, 'error')
    }

    handleDeleteCloseModal()
  }

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    // Trigger form validation
    if (!newProduct.title || !newProduct.description) {
      setValidated(true);
      return;
    }
    if (handleWordExceeded(newProduct?.title, 8)) {
      showToast('Title cannot exceed 8 words ')
      return
    }
    if (handleWordExceeded(newProduct?.description, 50)) {
      showToast('Description cannot exceed 50 words')
      return
    }
    try {
      let accessLink = null;

      // Upload the image if it exists
      if (currentImage?.file) {
        const data = await uploadImage(currentImage.file, 'products');
        console.log(data?.accessLink, 'data-accessLink');
        accessLink = data?.accessLink;
      }

      // Prepare the new list of products
      const updatedProducts = [...(products || []), { ...newProduct, image: accessLink }];

      // Remove `_id` properties if necessary
      const sanitizedProducts = updatedProducts.map((product) => {
        const { _id, ...rest } = product; // Destructure to remove `_id`
        return _id ? product : rest; // Return product without `_id` if it doesn't exist or is empty
      });

      // Create the updated data payload
      const updateData = {
        ...businesses,
        productSection: {
          title: productData?.title || '', // Default to an empty string if undefined
          description: productData?.description || '', // Default to an empty string if undefined
          data: sanitizedProducts, // Updated and sanitized list of products
        },
      };

      console.log(updateData, 'updated-data');

      // Update the business and add the product
      await updateBusiness(updateData);

      // Reset form state
      setCurrentImage({ image: null, preview: null });
      setValidated(false);
      handleCreateCloseModal();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };


  if (loading) {
    return <FullPageLoader />
  }

  return (
    <>
      {(imageLoading || loading) && <FullPageLoader />}
      <div className="flex justify-between items-center rounded-lg py-4">
        <h2 className="text-2xl font-semibold text-gray-700 m-0 p-0">Products</h2>
        <div className=" flex items-center space-x-4">
          <span className="flex items-center">
            <button
              className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
              onClick={handleShowCreateModal}
            >
              Add Product
            </button>
          </span>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        show={showCreateModal}
        onHide={handleCreateCloseModal}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            width: '500px',
          }}
        >
          <Modal.Header>
            <Modal.Title>Add Product</Modal.Title>
            <CloseButton onClick={handleCreateCloseModal} />
          </Modal.Header>
          <Modal.Body
            style={{
              padding: '24px',
            }}
          >
            <Form noValidate validated={validated} onSubmit={handleCreateProduct}>
              {/* Title Field */}
              <Form.Group controlId="formTitle">
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Title (8 words)"
                  id="title"
                  name="title"
                  autoComplete="title"
                  value={newProduct?.title}
                  onChange={handleCreateInputChange}
                  error={handleWordExceeded(newProduct?.title, 8)}
                  helperText={handleWordExceeded(newProduct?.title, 8) ? "exceeded the limit" : ""}
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
                  value={newProduct?.description}
                  onChange={handleCreateInputChange}
                  error={handleWordExceeded(newProduct?.description, 50)}
                  helperText={handleWordExceeded(newProduct?.description, 50) ? "exceeded the limit" : ""}
                  className="mb-4"
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <TextField
                  variant="outlined"
                  fullWidth
                  type='number'
                  label="Price"
                  id="price"
                  name="price"
                  autoComplete="price"
                  value={newProduct?.price}
                  onChange={handleCreateInputChange}
                  className="mb-4"
                />
              </Form.Group>
              {/* Image Upload Field */}
              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label>
                  Image <span style={{ color: 'grey' }}>(Ratio 1 : 1)</span>
                </Form.Label>
                <Form.Control
                  // required
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {currentImage.image && (
                  <img
                    src={currentImage.image}
                    alt="Preview"
                    className="w-1/2 mx-auto h-auto mt-4"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                      marginInline: 'auto',
                    }}
                  />
                )}
              </Form.Group>

              {/* Submit Button */}
              <Button

                type="submit"
                style={{
                  fontWeight: '500',
                  width: '100%',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  marginTop: '20px',
                }}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>


      <div className="mt-6">
        {/* Input Form */}
        <div className="mx-auto max-w-screen-sm">
          <form
            onSubmit={handleProductMainSubmit}
            className="bg-white p-4 border shadow-lg border-gray-400 rounded-md mb-6"
            style={{ maxWidth: '65rem', width: '100%' }}>
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
                value={productData?.title}
                onChange={setProductInputChange}
                error={handleWordExceeded(productData?.title, 8)}
                helperText={handleWordExceeded(productData?.title, 8) ? "exceeded the limit" : ""}
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
                value={productData?.description}
                onChange={setProductInputChange}
                error={handleWordExceeded(productData?.description, 50)}
                helperText={handleWordExceeded(productData?.description, 50) ? "exceeded the limit" : ""}
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

        {/* Products Table */}
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
              <th className="px-4 py-4 text-left border-r border-gray-400">
                Description
              </th>
              <th className="px-4 py-4 text-left border-r border-gray-400">
                Price
              </th>
              <th className="px-4 py-4 text-left border-r border-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => {
              if (product?.title || product?.description) {
                return (<tr
                  key={product?._id}
                  className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
                >
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    <img
                      src={product?.image || 'default-image.png'}
                      alt="Product"
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    {product?.title}
                  </td>
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    {product?.description}
                  </td>
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    {product?.price}
                  </td>
                  <td className="px-4 py-4 text-left border-r border-gray-400">
                    <button
                      variant="info"
                      onClick={() => handleShowModal(product)}
                    >
                      <img
                        alt="edit"
                        src="/icons/edit.svg"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    </button>
                    <button
                      variant="danger"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowDeleteModal(true)
                      }}
                    >
                      <img
                        alt="delete"
                        src="/icons/delete.svg"
                        className="w-6 h-6 rounded-full mr-2 fill-red-500"
                      />
                    </button>
                  </td>
                </tr>)
              }
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>Edit Product</Modal.Title>
          <CloseButton onClick={handleCloseModal} />
        </Modal.Header>
        <Form validated noValidate onSubmit={handleSaveChanges}>
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
                value={updatedProduct?.title}
                onChange={handleInputChange}
                error={handleWordExceeded(updatedProduct?.title, 8)}
                helperText={handleWordExceeded(updatedProduct?.title, 8) ? "exceeded the limit" : ""}
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
                value={updatedProduct?.description}
                onChange={handleInputChange}
                error={handleWordExceeded(updatedProduct?.description, 50)}
                helperText={handleWordExceeded(updatedProduct?.description, 50) ? "exceeded the limit" : ""}
                className="mb-4"
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <TextField
                variant="outlined"
                fullWidth
                type='number'
                label="Price"
                id="price"
                name="price"
                autoComplete="price"
                value={updatedProduct?.price}
                onChange={handleInputChange}
                className="mb-4"
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>
                Image <span style={{ color: 'grey' }}>(Ratio 1 : 1)</span>
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {currentImage.image && (
                <img
                  src={currentImage.image}
                  alt="Preview"
                  className="w-1/2 mx-auto h-auto mt-4"
                  style={{
                    objectFit: 'cover',
                    display: 'block',
                    marginInline: 'auto',
                  }}
                />
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit"  >
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Product Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>

      </Modal>
      <div className="m-auto flex justify-end mt-8">
        <Pagination
          totalItems={products?.totalCount}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        show={modalState.showCrop}
        onHide={() => {
          resetCropper()
          handleModalState('showCrop', false)
        }}
      >
        <Modal.Header>
          <Modal.Title>Crop Image</Modal.Title>
          <CloseButton onClick={() => {
            resetCropper()
            handleModalState('showCrop', false)
          }} />
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container position-relative"
            style={{ height: '400px' }}
          >
            <Cropper
              image={currentImage.preview}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
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
                currentImage.preview,
                croppedAreaPixels,
              )
              setCurrentImage((prev) => ({
                ...prev,
                preview: fileUrl,
                image: fileUrl,
                file: blob,
              }))
              handleModalState('showCrop', false)
            }}
          >
            Crop & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Judges