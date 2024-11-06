import { useEffect, useState } from "react";
import { getApi } from "../api/api";

const useLeads = () => {

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getApi("api/v1/contact_forms", true);
      console.log(response.data, "data");
      setLeads(response?.data);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchLeads();
  }, []);

  return {
    leads,
    loading,
  };
};

export default useLeads;
