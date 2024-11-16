import { useEffect, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import Pagination from "../Pagination";
import Loader from '../Loader/Loader';
import useNewsArticles from '../../api/news';

const News = () => {
    const { imageLoading, uploadImage } = useImageUpload()
    const {
        newsArticles,
        loading,
        totalNews,
        getNewsArticles,
        updateNewsArticles,
        addNewsArticles
    } = useNewsArticles()
    useEffect(() => {
        const getNews = async () => {
            await getNewsArticles()
        }
        getNews()
    }, [])
    console.log(totalNews);

    const [news, setNews] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newNewsArticle, setNewNewsArticle] = useState({
        title: '',
        description: '',
        link: "",
        isBanner: false,
    })
    const [showMore, setShowMore] = useState({ index: -1, status: false })
    const [imageCreatePreview, setImageCreatePreview] = useState('')
    const [imageFile, setImageFile] = useState(null)

    const [updatedNews, setUpdatedNews] = useState({
        _id: '',
        title: '',
        description: '',
        link: "",
        isBanner: false,
    })
    const [imagePreview, setImagePreview] = useState('')

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        setNews(newsArticles?.data)
    }, [newsArticles])

    const handleShowModal = (newsData) => {
        setSelectedProduct(newsData)
        setUpdatedNews({
            _id: newsData._id,
            title: newsData.title,
            description: newsData.description,
            link: newsData.link,
            isBanner: newsData.isBanner
        })
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedProduct(null)
        setUpdatedNews({
            _id: '',
            title: '',
            description: '',
            link: '',
            isBanner: false
        })
    }

    const handleCreateCloseModal = () => {
        setShowCreateModal(false)
        setNewNewsArticle({
            _id: '',
            title: '',
            description: '',
            link: '',
            isBanner: false
        })
        setImageCreatePreview('')
    }

    const handleDeleteCloseModal = () => {
        setShowDeleteModal(false)
    }

    const handleShowCreateModal = () => setShowCreateModal(true)

    const handleInputChange = async (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setUpdatedNews((prevNewsData) => ({ ...prevNewsData, isBanner: checked }))
        } else {
            setUpdatedNews((prevNewsData) => ({ ...prevNewsData, [name]: value }))
        }
    }

    // Fix handleCreateInputChange similarly
    const handleCreateInputChange = async (e) => {
        const { name, value, type, checked } = e.target

        if (type === 'checkbox') {
            setNewNewsArticle((prevNewsData) => ({ ...prevNewsData, isBanner: checked }))
        } else {
            setNewNewsArticle((prevNewsData) => ({ ...prevNewsData, [name]: value }))
        }
    }
    const handleSaveChanges = async () => {

        await updateNewsArticles(updatedNews)
        handleCloseModal()
    }

    const handleDeleteNews = async () => {
        setNews((prevNews) =>
            prevNews.filter((data) => data._id !== selectedProduct._id),
        )
        await updateNewsArticles({
            ...updatedNews,
            isDeleted: !updatedNews?.isDeleted
        })

        handleDeleteCloseModal()
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleCreateNewsArticle = async () => {
        await addNewsArticles({ ...newNewsArticle })
        handleCreateCloseModal()
    }

    return (
        <>
            {/* {(imageLoading || loading)&&} */}
            <div className="flex rounded-lg p-4">
                <h2 className="text-2xl font-semibold text-gray-700">News & Articles</h2>
                <div className="ml-auto flex items-center space-x-4">
                    <span className="flex items-center">
                        <span
                            className="bg-[#105193] hover:bg-[#107D93] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
                            onClick={handleShowCreateModal}
                        >
                            Add Articles
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
                            Add Articles
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
                                    value={newNewsArticle.title}
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
                                    value={newNewsArticle.description}
                                    onChange={handleCreateInputChange}
                                    style={{
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        padding: '10px',
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formImage" className="mt-3">
                                <Form.Label style={{ fontWeight: '500' }}>Link</Form.Label>
                                <Form.Control
                                    type="link"
                                    name="link"
                                    required
                                    value={newNewsArticle.link}
                                    onChange={handleCreateInputChange}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formImage" className="mt-3">
                                <Form.Label style={{ fontWeight: '500' }}>Make it a banner</Form.Label>
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
                            borderTop: '1px solid #eaeaea',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '16px',
                        }}
                    >
                        <Button
                            onClick={handleCreateNewsArticle}
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
                                key={index}>
                                <td className="px-4 py-2 border-r border-gray-400">
                                    {index + 1}
                                </td>
                                <td
                                    style={{ cursor: "pointer" }}
                                    className="px-4 py-2 border-r border-gray-400">
                                    <p>{data?.title}</p>
                                </td>

                                <td className="px-4 py-2 border-r border-gray-400">
                                    <div className="flex -space-x-2">
                                        {showMore?.index === index && showMore?.status ? data?.description.substring(0) : data?.description.substring(0, 100)}
                                        <a onClick={(() => setShowMore({ index: index, status: !showMore?.status }))} className="font-light text-xs ">{showMore?.status && showMore?.index === index ? "Show Less.." : "Show More..."}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-r border-gray-400">
                                    <div className="flex -space-x-2">
                                        <img className={`${data?.isBanner ? " border-green-600 border-2" : ""} rounded`} src="https://images.indianexpress.com/2024/11/Elon-Musk-2.jpg?w=640" />
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-r border-gray-400">
                                    <div className="flex -space-x-2"><a target='_blank' href={data?.link}>Url</a> </div>
                                </td>

                                <td className="px-4 py-2 border-r border-gray-400">
                                    <button variant="info"
                                        onClick={() => handleShowModal(data)}
                                    >
                                        <img
                                            alt="pics"
                                            src="/icons/edit.svg"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    </button>{' '}
                                    <button
                                        variant="danger"
                                        onClick={() => {
                                            setUpdatedNews(data)
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
                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label style={{ fontWeight: '500' }}>Link</Form.Label>
                            <Form.Control
                                type="link"
                                name="link"
                                required
                                value={updatedNews.link}
                                onChange={handleCreateInputChange}
                                style={{
                                    borderRadius: '8px',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label style={{ fontWeight: '500' }}>Make it a banner</Form.Label>
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
        </>
    )
}

export default News


