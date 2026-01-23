import { AxiosError } from "axios";
import API from "../../../api/axios";
import { CreateOrderSatisfactionRequest } from "../types/OrderSatisfactionTypes";

export const createOrderSatisfaction = async (
  data: CreateOrderSatisfactionRequest
) => {
  try {
    const response = await API.post(
      /*"/api/orders/satisfaction", -- esta mal*/
      "/sales/Order/create/satisfaction",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Error al enviar la valoración");
    }
    throw new Error("Error inesperado");
  }
};
