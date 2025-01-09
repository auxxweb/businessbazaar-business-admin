import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Spinner } from "react-bootstrap";
import { useSEO } from "../api/useSEO";
import { toast } from "sonner";

const SeoDetails = () => {
  const fixedSocialMediaLinks = [
    { tag: "instagram", link: "" },
    { tag: "facebook", link: "" },
    { tag: "twitter", link: "" },
    { tag: "youtube", link: "" },
    { tag: "linkedin", link: "" },
  ];

  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    metaTags: [],
  });

  const [socialMediaLinks, setSocialMediaLinks] = useState(fixedSocialMediaLinks);
  const [loading, setLoading] = useState(false);

  const { seoDetails, updateSeoDetails, getSeoDetails } = useSEO();

  useEffect(() => {
    const fetchSeo = async () => {
      await getSeoDetails(); // Fetch initial data
    };
    fetchSeo();
  }, []);

  useEffect(() => {
    if (seoDetails?.seoData) {
      const { title, description, metaTags } = seoDetails.seoData;

      // Update SEO data
      setSeoData({
        title: title || "",
        description: description || "",
        metaTags: metaTags || [],
      });

      // Map metaTags URLs to fixedSocialMediaLinks
      const updatedSocialMediaLinks = fixedSocialMediaLinks.map((fixed, index) => {
        return {
          tag: fixed.tag,
          link: metaTags[index] || "", // Match index directly from metaTags array
        };
      });

      setSocialMediaLinks(updatedSocialMediaLinks);
    }
  }, [seoDetails]);

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Extract links to save in metaTags
      const updatedMetaTags = socialMediaLinks.map((link) => link.link);
      const updatedSeoData = { ...seoData, metaTags: updatedMetaTags };


      const updatedData = {
        ...seoDetails,
        seoData: updatedSeoData, // Directly replace seoData
      };
      await updateSeoDetails(updatedData);
      toast.success("Business Updated successfully", {
        theme: "colored",
        position: "top-right", // Position the toast at the top-center of the screen
        style: {
          backgroundColor: "green", // Custom green background color for success
          color: "#FFFFFF", // White text
          height: "60px", // Set a higher height for the toast
          fontSize: "14px", // Increase font size for better readability
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }
      });
    } catch (error) {
      console.error("Error updating SEO details:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div >
      <h1 className="">SEO Details</h1>
   
    <form
      onSubmit={handleSeoSubmit}
      className="bg-white p-4 border shadow-lg border-gray-400 rounded-md mb-6"
      style={{ maxWidth: "65rem", width: "100%" }}
    >
      <div className="flex flex-col space-y-4">
        {/* Title Input */}
        <TextField
          variant="outlined"
          required
          fullWidth
          label="Title"
          name="title"
          value={seoData.title}
          onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
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

        {/* Social Media Links */}
        <div>
          {socialMediaLinks.map((link, index) => (
            <TextField
              key={index}
              fullWidth
              label={`${link.tag.charAt(0).toUpperCase() + link.tag.slice(1)} Link`}
              placeholder={`Enter ${link.tag} link`}
              value={link.link}
              onChange={(e) => {
                const updatedLinks = [...socialMediaLinks];
                updatedLinks[index].link = e.target.value;
                setSocialMediaLinks(updatedLinks);
              }}
              className="my-2"
            />
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
              Save & Next
            </button>
          )}
        </div>
      </div>
    </form>
    </div>
  );
};

export default SeoDetails;
