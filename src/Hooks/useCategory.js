import { useEffect, useState } from "react";
import { getApi } from "../api/api";

const useCategory = (category_id) => {
  const [category, setCategory] = useState([]);
  const [allCategories, setAllCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategory = async (id) => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/category/${id}`, true);
      setCategory(response?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/category/all`, true);
      setAllCategory(response?.data?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category_id) {
      fetchCategory(category_id);
    }
  }, [category_id]);

  return {
    fetchCategory,
    fetchAllCategories,
    category,
    allCategories,
    loading,

  };
};

export default useCategory;
