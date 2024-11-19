import { toast } from "sonner";
import { deleteApi, getApi, patchApi, postApi } from "./api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useNewsArticles = () => {
    const [newsArticles, setNewsArticles] = useState(null);
    const [totalNews, setTotalNews] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const logout = async () => {
        setNewsArticles(null);
        localStorage.removeItem("userCredential");
        navigate("/login");
    };

    const getNewsArticles = async () => {
        setLoading(true);
        try {
            const response = await getApi(
                `api/v1/business-news`,
                true,
                logout,
                navigate
            );
            setNewsArticles(response?.data);
            setTotalNews(response?.data?.totalCount)
        } catch (error) {
            setLoading(false);
            toast.error(
                error?.response?.data?.message ?? "Something went wrong ,try again!!"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateNewsArticles = async (updateData) => {
        setLoading(true);
        try {
            const response = await patchApi(
                `api/v1/business-news/${updateData?._id}`,
                { ...updateData },
                true,
                logout,
                navigate
            );
            if (response?.data) {
                await getNewsArticles()
                toast.success("Landing Page Updated successfully", {
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
            }
        } catch (error) {
            setLoading(false);
            toast.error(
                error?.response?.data?.message ?? "Something went wrong ,try again!!"
            );
        } finally {
            setLoading(false);
        }
    };

    
    const deleteNewsArticles = async (id) => {
        setLoading(true);
        try {
            const response = await deleteApi(
                `api/v1/business-news/${id}`,
                true,
                logout,
                navigate
            );
            if (response?.data) {
                toast.success("News Removed successfully!", {
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
            }
        } catch (error) {
            setLoading(false);
            toast.error(
                error?.response?.data?.message ?? "Something went wrong ,try again!!"
            );
        } finally {
            setLoading(false);
        }
    };

    const addNewsArticles = async (formData) => {
        setLoading(false);
        try {
            const response = await postApi(
                `api/v1/business-news`,
                { ...formData },
                true,
                logout,
                navigate
            );
            await getNewsArticles()
            return response?.data;
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message ?? "Something went wrong!", {
                theme: "colored",
                position: "top-right",
                style: {
                    backgroundColor: "red",
                    color: "#FFFFFF",
                    height: "60px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center"
                }
            });
        } finally {
            setLoading(false);
        }
    };


    return {
        getNewsArticles,
        loading,
        newsArticles,
        totalNews,
        updateNewsArticles,
        addNewsArticles,
        deleteNewsArticles
    };
};
export default useNewsArticles;
