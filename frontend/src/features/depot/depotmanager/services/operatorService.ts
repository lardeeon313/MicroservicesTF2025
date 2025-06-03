
import axios from "axios";

const API_BASE = "/api/depotmanager/operators";

export const operatorService = {
  getOperatorById: async (id: string) => {
    const { data } = await axios.get(`${API_BASE}/${id}`);
    return data;
  },
};
