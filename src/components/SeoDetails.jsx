import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Spinner } from "react-bootstrap";
import { useSEO } from "../api/useSEO";
import { toast } from "sonner";

const SeoDetails = () => {
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    metaTags: [],
    newTag: "", // Tracks the current input for a new meta tag
  });

  const [loading, setLoading] = useState(false);

  const { seoDetails, updateSeoDetails, getSeoDetails } = useSEO();

  useEffect(() => {
    const fetchSeo = async () => {
      await getSeoDetails(); // Fetch initial SEO details
    };
    fetchSeo();
  }, []);

  useEffect(() => {
    if (seoDetails?.seoData) {
      const { title, description, metaTags } = seoDetails.seoData;
      setSeoData({
        title: title || "",
        description: description || "",
        metaTags: metaTags || [],
        newTag: "", // Reset the new tag input
      });
    }
  }, [seoDetails]);

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty meta tags
      const filteredMetaTags = seoData.metaTags.filter(
        (tag) => tag.trim() !== ""
      );

      const updatedData = {
        ...seoDetails,
        seoData: {
          ...seoData,
          metaTags: filteredMetaTags,
        },
      };

      await updateSeoDetails(updatedData);
      toast.success("SEO details updated successfully!", {
        theme: "colored",
        position: "top-right",
        style: {
          backgroundColor: "green",
          color: "#FFFFFF",
          height: "60px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      });
    } catch (error) {
      console.error("Error updating SEO details:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetaTag = () => {
    if (seoData.newTag.trim() !== "") {
      setSeoData((prev) => ({
        ...prev,
        metaTags: [...prev.metaTags, prev.newTag],
        newTag: "", // Clear the input field
      }));
    }
  };

  const handleRemoveMetaTag = (index) => {
    setSeoData((prev) => ({
      ...prev,
      metaTags: prev.metaTags.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <form
        onSubmit={handleSeoSubmit}
        className="bg-white p-4 border shadow-lg border-gray-400 rounded-md mb-6 mx-auto"
        style={{ maxWidth: "38rem", width: "100%" }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Edit SEO Details
        </h2>
        <div className="flex flex-col space-y-4">
          {/* Title Input */}
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Title"
            name="title"
            value={seoData.title}
            onChange={(e) =>
              setSeoData({ ...seoData, title: e.target.value })
            }
          />

          {/* Description Input */}
          <TextField
            variant="outlined"
            required
            fullWidth
            multiline
            rows={5}
            label="Description"
            name="description"
            value={seoData.description}
            onChange={(e) =>
              setSeoData({ ...seoData, description: e.target.value })
            }
          />

          {/* Meta Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Meta Tags</h3>
            <div className="flex items-center space-x-4 mb-4">
              <TextField
                fullWidth
                placeholder="Add a meta tag"
                value={seoData.newTag}
                onChange={(e) =>
                  setSeoData({ ...seoData, newTag: e.target.value })
                }
              />
              <button
                type="button"
                onClick={handleAddMetaTag}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                style={{ backgroundColor: "#105193" }}
              >
                Add
              </button>
            </div>
            {seoData.metaTags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 bg-blue-100 rounded mb-2"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveMetaTag(index)}
                >
                  &#x2715; {/* 'X' icon for deletion */}
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            {loading ? (
              <Spinner variant="primary" />
            ) : (
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-md shadow hover:bg-blue-600"
                style={{ backgroundColor: "#105193" }}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeoDetails;
