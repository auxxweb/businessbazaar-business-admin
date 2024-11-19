import { useEffect, useState } from "react";
import { getApi } from "../api/api";

const useNewsArticles = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalNews, setTotalNews] = useState(0);
    const [reFetch, setReFetch] = useState(false);
    const refetch = async () => {
        setReFetch(!reFetch);
    };

    const fetchNews = async ({ page = 1, limit = 10, searchTerm = "" }) => {
        setLoading(true);
        try {
            const response = await getApi(
                `api/v1/contact_forms?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
                true
            );
            console.log(response, "data---news");
            setNews(response?.data?.data);
            setTotalNews(response?.data?.totalCount ?? 0);
        } catch (e) {
            console.log(e, "error");
        } finally {
            setLoading(false);
        }
    };


    return {
        news,
        loading,
        totalNews,
        fetchNews
    };
};

export default useNewsArticles;
