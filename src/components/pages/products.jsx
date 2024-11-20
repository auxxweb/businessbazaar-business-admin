import { useEffect, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import useBusiness from '../../api/useBusiness'
import Pagination from "../Pagination";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropper.utils';

const Judges = () => {
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

  const [products, setProducts] = useState([])
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
  const [page, setPage] = useState(1);
  const limit = 10;
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
  useEffect(() => {
    setProducts(businesses?.productSection)
  }, [businesses])

  const handleShowModal = (product) => {
    setSelectedProduct(product)
    setUpdatedProduct({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
    })
    setCurrentImage({preview:product.image,image:product.image}) // Initialize preview with current image
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
    setImagePreview('')
  }

  const handleCreateCloseModal = () => {
    setShowCreateModal(false)
    setNewProduct({
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
  const handleSaveChanges = async () => {
    let accessLink = null
    if (currentImage?.file) {
      const data = await uploadImage(currentImage?.file, 'products')
      accessLink = data?.accessLink
    }
    const updatedProducts = products.map((product) =>
      product._id === updatedProduct._id
        ? { ...updatedProduct, image: accessLink }
        : product,
    )
    const updateData = {
      productSection: updatedProducts,
    }
    console.log(updateData, 'updated-data')

    await updateBusiness(updateData)
    setCurrentImage({image:null,preview:null})
    handleCloseModal()
  }

  const handleDeleteProduct = async () => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== selectedProduct._id),
    )

    const updatedData = {
      productSection: products.filter(
        (product) => product._id !== selectedProduct._id,
      ),
    }
    const updateData = {
      productSection: updatedData,
    }
    console.log(updateData)

    await updateBusiness(updatedData)
    setCurrentImage({image:null,preview:null})

    handleDeleteCloseModal()
  }
  
  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleCreateProduct = async () => {
    let accessLink = null
    if (currentImage?.file) {
      const data = await uploadImage(currentImage?.file, 'products')
      console.log(data?.accessLink, 'data-accessLink')
      accessLink = data?.accessLink
    }

    await addProduct({ ...newProduct, image: accessLink })
    setCurrentImage({image:null,preview:null})
    handleCreateCloseModal()
  }

  return (
    <>
      {/* {(imageLoading || loading)&&} */}
      <div className="flex rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-700">Products</h2>
        <div className="ml-auto flex items-center space-x-4">
          <span className="flex items-center">
            <span
              className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
              onClick={handleShowCreateModal}
            >
              Add Product
            </span>
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
          <Modal.Header
            closeButton
            style={{
              borderBottom: '1px solid #eaeaea',
              padding: '16px 24px',
            }}
          >
            <Modal.Title style={{ fontWeight: '500', fontSize: '1.25rem' }}>
              Add Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: '24px',
            }}
          >
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label style={{ fontWeight: '500' }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  required
                  value={newProduct.title}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    padding: '10px',
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label style={{ fontWeight: '500' }}>
                  Description
                </Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  required
                  value={newProduct.description}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    padding: '10px',
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formPrice" className="mt-3">
                <Form.Label style={{ fontWeight: '500' }}>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    padding: '10px',
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image <span style={{color:'grey'}}>(Ratio 1 : 1)</span></Form.Label>
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
              className="w-1/2 mx-auto h-auto mt-4"
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
          <Modal.Footer
            style={{
              borderTop: '1px solid #eaeaea',
              display: 'flex',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <Button
              onClick={handleCreateProduct}
              style={{
                fontWeight: '500',
                padding: '10px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

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
              Price
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr
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
                {product?._id}
              </td>
              <td className="px-4 py-4 text-left border-r border-gray-400">
                {product?.price}
              </td>
              <td className="px-4 py-4 text-left border-r border-gray-400">
                <button variant="info" onClick={() => handleShowModal(product)}>
                  <img
                    alt="pics"
                    src="/icons/edit.svg"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                </button>{' '}
                <button
                  variant="danger"
                  onClick={() => {
                    setSelectedProduct(product)
                    setShowDeleteModal(true)
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
              <Form.Label>Image <span style={{color:'grey'}}>(Ratio 1 : 1)</span></Form.Label>
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
              className="w-1/2 mx-auto h-auto mt-4"
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
              aspect={1 / 1}
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
  )
}

export default Judges
