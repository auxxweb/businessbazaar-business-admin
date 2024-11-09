import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessData } from "../../api/slices/business";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../api/api";

const LandingPage = () => {
  // const businessData = useSelector((state) => state.business.data);

  const [businessData,setBusinessData] = useState([])
  
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();

  const dispatch = useDispatch();

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const preReq = await preRequestFun(file, "landing");
        if (preReq && preReq.accessLink) {
          setImage(preReq.accessLink);
          setImagePreview(preReq.accessLink);
        }
      } catch (error) {
        console.error("Image upload error:", error.message || error);
      }
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const businessDetails = await getApi(`api/v1/business/profile`,true,dispatch,navigate);
      setBusinessData(businessDetails.data)
      setTitle(businessDetails.data.landingPageHero.title)
      setDescription(businessDetails.data.landingPageHero.description)
      setImagePreview(businessDetails.data.landingPageHero.coverImage)
      
    }
    fetchData()

  }, []);

  const handleLandingSubmit = () => {
    // Prepare updated business data immutably
    const updatedData = {
      ...businessData,
      landingPageHero: {
        ...businessData.landingPageHero,
        title,
        description,
        coverImage: image,
      },
    };

    // Dispatch updated data to Redux store
    dispatch(setBusinessData(updatedData));
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Edit Landing Page</h2>
      
      {/* Title Input */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Input with Preview */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 text-sm font-medium mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Image Preview</label>
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg" />
        </div>
      )}

      {/* Save Changes Button */}
      <button
        onClick={handleLandingSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition btn btn-success"
      >
        Save Changes
      </button>
    </div>
  );
};

export default LandingPage;
