import { useEffect, useState } from "react";
import { getApi } from "../api/api";

const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [reFetch, setReFetch] = useState(false);
  const refetch = async () => {
    setReFetch(!reFetch);
  };

  const fetchLeads = async ({ page = 1, limit = 10, searchTerm = "" }) => {
    setLoading(true);
    try {
      const response = await getApi(
        `api/v1/contact_forms?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        true
      );
      console.log(response, "data---lead");
      setLeads(response?.data?.data);
      setTotalLeads(response?.data?.totalCount ?? 0);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };


  return {
    leads,
    loading,
    totalLeads,
    fetchLeads
  };
};

export default useLeads;
