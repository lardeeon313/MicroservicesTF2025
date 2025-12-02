import API from "../../../../../../api/axios";

export const getCompletedOrdersReports = async (from?: string | null, to?: string | null) => {
  const params: any = {};

  if (from) params.from = from;
  if (to) params.to = to;

  const res = await API.get("/depot/depotreports/reports/orders-completed", { params });
  return res.data;
};