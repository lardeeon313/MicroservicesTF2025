//service para resolver dicho incidente , en tal caso de resolverlo quedaria con status 
//resolved? 
// services/postResolvedIncident.ts
import API from "../../services/axios";
import { ResolveDeliveryIncidentRequest } from "../types/Request";

export const PostResolveDeliveryIncident = async (request: ResolveDeliveryIncidentRequest) => {
  console.log("📦 Enviando request a API:", request);

  const response = await API.post(
    "/logistic/DeliveryOperator/resolve-delivery-incident",
    request
  );

  console.log("✅ Respuesta del backend:", response.data);
  return response.data;
};
