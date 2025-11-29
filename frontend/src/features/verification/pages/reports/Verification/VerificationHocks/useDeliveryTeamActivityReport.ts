import { useState } from "react";
import API from "../../../../../../api/axios";
import { TeamActivityReport } from "../../../../types/Report";

type Filters = {
  startDate?: string;
  endDate?: string;
  deliveryTeamId?: number;
};

export const useDeliveryTeamActivity = () => {
  const [data, setData] = useState<TeamActivityReport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (filters: Filters = {}) => {
    try {
      
      setLoading(true);

      const res = await API.get("/logistic/LogisticReport/delivery-team-activity", {
        params: filters,
      });
      
      console.log(res)

      
      setData(res.data);
    } catch (e) {
      console.error("❌ Error fetching delivery team report:", e);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetchReport };
};
