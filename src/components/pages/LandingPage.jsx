import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const { landingPageHero } = useSelector((state) => state.business.data);
  
  // Local state to manage input fields
  const [title, setTitle] = useState(landingPageHero.title);
  const [description, setDescription] = useState(landingPageHero.description);
  const [image, setImage] = useState(landingPageHero.coverImage);
  const [imagePreview, setImagePreview] = useState(landingPageHero.coverImage);

  // Handle file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
    }
  };

  useEffect(() => {
    // Update image preview when landingPageHero.coverImage changes
    setImagePreview(landingPageHero.coverImage);
  }, [landingPageHero.coverImage]);

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
        onClick={() => console.log({ title, description, image })}
        className="mt-6 bg-[#105193] text-white py-2 px-4 rounded-lg hover:bg-[#107D93] transition "
      >
        Save Changes
      </button>
    </div>
  );
};

export default LandingPage;
