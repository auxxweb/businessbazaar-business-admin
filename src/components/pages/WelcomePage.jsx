import { useState, useEffect } from 'react'
import useBusiness from '../../api/useBusiness'
import useImageUpload from '../../api/imageUpload/useImageUpload'
import { toast } from 'sonner'
import FullPageLoader from '../FullPageLoader/FullPageLoader';

export default function WelcomePage() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState()

  const [businessData, setBusinessData] = useState({
    title: '',
    description: '',
    coverImage: '',
  })

  const { businesses, loading, getBusiness, updateBusiness } = useBusiness()
  const { imageLoading, uploadImage } = useImageUpload()

  const handlePreviewImage = async (e) => {
    const imageFile = e.target.files[0]

    // Check if the file is selected and its size is within the limit
    if (!imageFile || imageFile?.size > 5 * 1024 * 1024) {
      // Optionally, you could show an error toast here
      toast.warning('Please select a valid image file (less than 5 MB).', {
        position: 'top-right',
        duration: 2000,
        style: {
          backgroundColor: '#e5cc0e', // Custom yellow color for warning
          color: '#FFFFFF', // Text color
        },
        dismissible: true,
      })
      return
    } else {
      setImageFile(imageFile)
      setImagePreview(URL.createObjectURL(imageFile))
    }
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness()
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    if (businesses) {
      setBusinessData({
        title: businesses?.welcomePart?.title,
        description: businesses?.welcomePart?.description,
        coverImage: businesses?.welcomePart?.coverImage,
      })
    }
  }, [businesses])

  const handleInputChange = async (e) => {
    setBusinessData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLandingSubmit = async (e) => {
    e.preventDefault()

    try {
      let imgAccessUrl = businessData?.coverImage
      if (imageFile) {
        const data = await uploadImage(imageFile, 'landingPage')
        imgAccessUrl = data?.accessLink
      }
      // Prepare updated business data immutably
      const updatedData = {
        welcomePart: {
          ...businesses?.welcomePart,
          title: businessData?.title,
          description: businessData?.description,
          coverImage: imgAccessUrl,
        },
      }
      await updateBusiness(updatedData)
    } catch (error) {
      toast.error('Something went wrong , please try again!')
    }
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        {(loading || imageLoading) && <FullPageLoader />}
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Edit Welcome Page
      </h2>

      {/* Title Input */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={businessData?.title}
          name="title"
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={businessData?.description}
          onChange={handleInputChange}
          rows="4"
          name="description"
          className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Input with Preview */}
      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-gray-700 text-sm font-medium mb-1"
        >
          Image<span style={{color:'grey'}}>(Ratio  5 : 7)</span>
        </label>
        <input
          type="file"
          id="image"
          onChange={handlePreviewImage}
          className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Preview */}
      {(imagePreview || businessData?.coverImage) && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Image Preview
          </label>
          <img
            src={imagePreview ?? businessData?.coverImage}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Save Changes Button */}
      <button
        onClick={handleLandingSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  )
}
