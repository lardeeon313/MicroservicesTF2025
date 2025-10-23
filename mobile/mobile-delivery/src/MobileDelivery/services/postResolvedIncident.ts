//service para resolver dicho incidente , en tal caso de resolverlo quedaria con status 
//resolved? 
import API from "../../services/axios";
import { ResolveDeliveryIncidentRequest } from "../types/Request";

export const PostResolveDeliveryIncident = async (request: ResolveDeliveryIncidentRequest): Promise<void> => {
  try {
    const response = await API.post(
      "/logistic/DeliveryOperator/resolve-delivery-incident",
      request
    );
    console.log("✅ Incidente de entrega resuelto:", response.data);
  } catch (error: any) {
    console.error(
      "❌ Error al resolver el incidente de entrega:",
      error.response?.data || error.message
    );
    throw error;
  }
};