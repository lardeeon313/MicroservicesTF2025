//5: service para reportar que un pedido tuvo dicho incidente: 
import API from "../../services/axios";
import { ReportDeliveryIncidentRequest } from "../types/Request";

export const PostReportDeliveryIncident = async (request: ReportDeliveryIncidentRequest): Promise<void> => {
  try {
    const response = await API.post(
      "/logistic/DeliveryOperator/report-delivery-incident",
      request
    );
    console.log("⚠️ Incidente de entrega reportado exitosamente:", response.data);
  } catch (error: any) {
    console.error(
      "❌ Error al reportar el incidente de entrega:",
      error.response?.data || error.message
    );
    throw error;
  }
};