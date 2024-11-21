import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Pagination from "../Pagination";
import Loader from "../Loader/Loader";
import useNewsArticles from "../../api/news";
import useImageUpload from "../../api/imageUpload/useImageUpload";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropper.utils";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

const News = () => {
  const { imageLoading, uploadImage } = useImageUpload();
  const {
    newsArticles,
    loading,
    totalNews,
    getNewsArticles,
    updateNewsArticles,
    addNewsArticles,
    deleteNewsArticles,
  } = useNewsArticles();
  useEffect(() => {
    const getNews = async () => {
      await getNewsArticles();
    };
    getNews();
  }, []);

  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNewsArticle, setNewNewsArticle] = useState({
    title: "",
    description: "",
    link: "",
    isBanner: false,
    image: null,
  });
  const [showMore, setShowMore] = useState({ index: -1, status: false });
  const [updatedNews, setUpdatedNews] = useState({
    _id: "",
    title: "",
    description: "",
    link: "",
    isBanner: false,
    image: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [imageCreatePreview, setImageCreatePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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

  useEffect(() => {
    setNews(newsArticles?.data);
  }, [newsArticles]);

  const handleShowModal = (newsData) => {
    setSelectedProduct(newsData);
    setUpdatedNews({
      _id: newsData._id,
      title: newsData.title,
      description: newsData.description,
      link: newsData.link,
      isBanner: newsData.isBanner,
      image: newsData.image,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setUpdatedNews({
      _id: "",
      title: "",
      description: "",
      link: "",
      isBanner: false,
      image: null,
    });
  };

  const handleCreateCloseModal = () => {
    setShowCreateModal(false);
    setNewNewsArticle({
      _id: "",
      title: "",
      description: "",
      link: "",
      isBanner: false,
      image: null,
    });
  };

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        console.error("Access link not found in response.");
      }
    } else if (type === "checkbox") {
      setUpdatedNews((prevNewsData) => ({
        ...prevNewsData,
        isBanner: checked,
      }));
    } else {
      setUpdatedNews((prevNewsData) => ({ ...prevNewsData, [name]: value }));
    }
  };

  // Fix handleCreateInputChange similarly
  const handleCreateInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      const file = e.target.files[0];

      if (file) {
        setImageFile(file);
        setImageCreatePreview(URL.createObjectURL(file));
      } else {
        console.error("Access link not found in response.");
      }
    } else if (type === "checkbox") {
      setNewNewsArticle((prevNewsData) => ({
        ...prevNewsData,
        isBanner: checked,
      }));
    } else {
      setNewNewsArticle((prevNewsData) => ({ ...prevNewsData, [name]: value }));
    }
  };
  const handleSaveChanges = async () => {
    console.log(currentImage);
    
    if (currentImage?.file) {
      uploadImage(currentImage?.file, "news").then(async (response) => {
        if (response?.accessLink) {
          await updateNewsArticles({
            ...updatedNews,
            image: response?.accessLink,
          });
        }
      });
    } else {
      await updateNewsArticles({ ...updatedNews });
    }
    setImageFile(null);
    handleCloseModal();
  };

  const handleDeleteNews = async () => {
    setNews((prevNews) =>
      prevNews.filter((data) => data._id !== updatedNews._id)
    );
    await deleteNewsArticles(updatedNews._id);

    handleDeleteCloseModal();
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleCreateNewsArticle = async () => {
    if (currentImage?.file) {
      uploadImage(currentImage?.file, "news").then(async (response) => {
        if (response?.accessLink) {
          await addNewsArticles({
            ...newNewsArticle,
            image: response?.accessLink,
          });
        }
      });
    } else {
      await addNewsArticles({ ...newNewsArticle });
    }
    setImageFile(null);
    handleCreateCloseModal();
  };

  return (
    <>
      {imageLoading && <FullPageLoader />}
      <div className="flex rounded-lg py-4 items-center justify-between">
        <h2 className="text-2xl font-semibold text-nowrap text-gray-700 p-0 m-0  " >
          News & Articles
        </h2>
        <div className=" flex items-center ">
          <span className="flex items-center">
            <button
              className="bg-[#105193] hover:bg-[#107D93] text-white text-nowrap rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
              onClick={handleShowCreateModal}
            >
              Add Articles
            </button>
          </span>
        </div>
      </div>

      {/* Add Product Modal */}
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
            <Modal.Title  style={{ fontWeight: "500", fontSize: "1.25rem" }}>
              Add Articles
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "24px",
            }}
          >
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label style={{ fontWeight: "500" }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  required
                  value={newNewsArticle.title}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label style={{ fontWeight: "500" }}>
                  Description
                </Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  required
                  value={newNewsArticle.description}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    padding: "10px",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formLink" className="mt-3">
                <Form.Label style={{ fontWeight: "500" }}>Link</Form.Label>
                <Form.Control
                  type="link"
                  name="link"
                  required
                  value={newNewsArticle.link}
                  onChange={handleCreateInputChange}
                  style={{
                    borderRadius: "8px",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label>
                  Image <span style={{ color: "grey" }}>(Ratio 16 : 9)</span>
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
                    className="w-1/2 mx-auto h-auto mt-4"
                    style={{
                      objectFit: "cover",
                      display: "block",
                      marginInline: "auto",
                    }}
                  />
                )}
              </Form.Group>
              <Form.Group controlId="formIsBanner" className="mt-3">
                <Form.Label style={{ fontWeight: "500" }}>
                  Make it a banner
                </Form.Label>
                <Form.Check
                  name="isBanner"
                  required
                  value={newNewsArticle?.isBanner ? true : false}
                  onChange={handleCreateInputChange}
                />
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
              onClick={handleCreateNewsArticle}
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

      <table className="min-w-full table-auto mt-6 border-collapse">
        <thead className="bg-white border-gray-400 border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px]">
          <tr>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Sl No
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Title
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Description
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Banner
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Url
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-70 border-[#969696]">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center">
                <div className="flex justify-center items-center">
                  <Loader />
                </div>
              </td>
            </tr>
          ) : (
            news?.map((data, index) => (
              <tr
                className="odd:bg-[#d4e0ec] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
                key={index}
              >
                <td className="px-4 py-2 border-r border-gray-400">
                  {index + 1}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  className="px-4 py-2 border-r border-gray-400"
                >
                  <p>{data?.title}</p>
                </td>

                <td className="px-4 py-2 border-r border-gray-400 ">
                  <div className="flex flex-col  justify-between border h-full ">
                  <div className="flex -space-x-2">
                    {showMore?.index === index && showMore?.status
                      ? data?.description.substring(0)
                      : data?.description.substring(0, 100)}
                    
                  </div>
                     <p  onClick={() =>
                        setShowMore({ index: index, status: !showMore?.status })
                      } className="m-0 p-0 text-xs text-end  text-blue-500 ">
                     {showMore?.status && showMore?.index === index
                        ? "Show Less..."
                        : "Show More..."}
                     </p>
                  </div>
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                  <LinkPreviewComponent url={data?.link} image={data?.image} />
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                  <div className="flex -space-x-2">
                    <a target="_blank" href={data?.link} rel="noreferrer">
                      Url
                    </a>{" "}
                  </div>
                </td>

                <td className="px-4 py-2 border-r border-gray-400">
                  <button variant="info" onClick={() => handleShowModal(data)}>
                    <img
                      alt="pics"
                      src="/icons/edit.svg"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  </button>{" "}
                  <button
                    variant="danger"
                    onClick={() => {
                      setUpdatedNews(data);
                      setShowDeleteModal(true);
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
            ))
          )}
        </tbody>
      </table>

      {/* Edit Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit News Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={updatedNews.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={updatedNews.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLink" className="mt-3">
              <Form.Label style={{ fontWeight: "500" }}>Link</Form.Label>
              <Form.Control
                type="link"
                name="link"
                required
                value={updatedNews.link}
                onChange={handleCreateInputChange}
                style={{
                  borderRadius: "8px",
                  padding: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>
                Image <span style={{ color: "grey" }}>(Ratio 16 : 9)</span>
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
                  className="w-1/2 mx-auto h-auto mt-4"
                  style={{
                    objectFit: "cover",
                    display: "block",
                    marginInline: "auto",
                  }}
                />
              )}
            </Form.Group>
            <Form.Group controlId="formIsBanner" className="mt-3">
              <Form.Label style={{ fontWeight: "500" }}>
                Make it a banner
              </Form.Label>
              <Form.Check
                name="isBanner"
                required
                value={updatedNews?.isBanner ? true : false}
                onChange={handleCreateInputChange}
              />
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
        <Modal.Body>Are you sure you want to delete this News?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleDeleteCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteNews}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="m-auto flex justify-end mt-8">
        <Pagination
          totalItems={totalNews}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>

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
              aspect={16 / 9}
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

const LinkPreviewComponent = ({ url, image }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isYouTubeVideo = isYouTubeURL(url);
    if (isYouTubeVideo) {
      setPreviewData({
        youtube: true,
      });
      setLoading(false);
    }
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.text();

        if (!isYouTubeVideo) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const image =
            doc
              .querySelector('meta[property="og:image"]')
              ?.getAttribute("content") || "";

          setPreviewData({
            image,
            youtube: false,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (!isYouTubeVideo) {
      fetchData();
    }
  }, [url]);

  const isYouTubeURL = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return (
      <div className="overflow-hidden  rounded" style={{ cursor: "pointer" }}>
        {/* <img src={PlaceholderBanner} alt="Link Preview" className='w-100 h-100' /> */}
      </div>
    );
  }

  if (previewData?.youtube) {
    return (
      <div className="overflow-hidden  rounded" style={{ cursor: "pointer" }}>
        <iframe src={url} frameborder="0" className="w-100 h-100"></iframe>
      </div>
    );
  }

  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="overflow-hidden  rounded"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {(previewData.image || image) && (
        <img
          src={image ?? previewData?.image}
          alt="Link Preview"
          className="w-100 h-100"
        />
      )}
    </div>
  );
};

export default News;
