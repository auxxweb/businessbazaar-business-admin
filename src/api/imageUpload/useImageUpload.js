import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { postApi } from "../api";
import axios from "axios";
import useBusiness from "../useBusiness";

const useImageUpload = () => {
  const [imageLoading, setLoading] = useState(false);
  const { logout } = useBusiness();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadImage = async (file, position) => {
    setLoading(true);
    try {
      const requestBody = {
        files: [
          {
            position: position,
            file_type: file.type
          }
        ]
      };

      const response = await postApi(
        `api/v1/s3url`,
        requestBody,
        true,
        logout,
        navigate
      );
      const preReq = response?.data[0];

      if (!preReq.url) {
        throw new Error("The URL is not defined in the response.");
      }
      await axios.put(preReq?.url, file, {
        headers: { "Content-Type": file?.type }
      });

      return preReq;
    } catch (error) {
      setLoading(false);
      console.log(error, "123456789");
      toast.error(
        error?.response?.data?.message ?? "Something went wrong ,try again!!"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    imageLoading,
    uploadImage
  };
};

export default useImageUpload;
