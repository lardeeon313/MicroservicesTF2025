import { AxiosError } from "axios";
import API from "../../../api/axios";
import { CreateOrderSatisfactionRequest } from "../types/OrderSatisfactionTypes";

export const createOrderSatisfaction = async (
  data: CreateOrderSatisfactionRequest
) => {
  try {
    console.log("📤 Enviando satisfacción al backend:", data);
    console.log("➡️ Endpoint: /sales/Order/create/satisfaction");
    const response = await API.post(
      /*"/api/orders/satisfaction", -- esta mal*/
      //NO PONER Order , es order
      "/sales/order/create/satisfaction",
      data
    );

    console.log("✅ Respuesta backend:", response.data);
    

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("📦 Error response:", error.response?.data);
      console.log("SE PRODUJO ERRORRRRRRRRRRRRRRR");
      console.log("📦 Status:", error.response?.status);
      throw new Error(error.response?.data?.message || "Error al enviar la valoración");
    }
    throw new Error("Error inesperado");
  }
};
