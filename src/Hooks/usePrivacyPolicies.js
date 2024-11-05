import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteApi, getApi, postApi } from "../api/api";

const usePrivacyPolicies = () => {
  const { _id } = useSelector((state) => state.business.data);

  const [privacyPolicies, setPrivacyPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrivacyPolicies = async () => {
    setLoading(true);
    try {
      const response = await getApi(`api/v1/privacy_policies/${_id}`, false);
      setPrivacyPolicies(response?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const createPrivacyPolicies = async (data) => {
    setLoading(true);
    try {
      await postApi("api/v1/privacy_policies", data);
      await fetchPrivacyPolicies();
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePrivacyPolicy = async (id) => {
    try {
      await deleteApi(`api/v1/privacy_policies/${id}`, true);
      await fetchPrivacyPolicies()
    } catch (e) {
      console.log(e, "error");
    }
  };

  useEffect(() => {
    if (_id) {
      fetchPrivacyPolicies();
    }
  }, [_id]);

  return {
    privacyPolicies,
    loading,
    createPrivacyPolicies,
    deletePrivacyPolicy,
  };
};

export default usePrivacyPolicies;
