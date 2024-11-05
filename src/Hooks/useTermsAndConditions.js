import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteApi, getApi, postApi } from "../api/api";

const useTermsAndConditions = () => {
  const { _id } = useSelector((state) => state.business.data);

  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTermsAndConditions = async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/terms_and_conditions/${_id}`, false);
      setTermsAndConditions(response?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const createTermsAndConditions = async (data) => {
    setLoading(true);
    try {
      await postApi("api/v1/terms_and_conditions", data);
      await fetchTermsAndConditions();
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTermsAndConditions = async (id) => {
    try {
      await deleteApi(`api/v1/terms_and_conditions/${id}`, true);
      await fetchTermsAndConditions()
    } catch (e) {
      console.log(e, "error");
    }
  };

  useEffect(() => {
    if (_id) {
      fetchTermsAndConditions();
    }
  }, [_id]);

  return {
    termsAndConditions,
    loading,
    createTermsAndConditions,
    deleteTermsAndConditions,
  };
};

export default useTermsAndConditions;
