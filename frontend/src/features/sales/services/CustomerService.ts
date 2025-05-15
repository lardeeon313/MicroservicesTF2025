import API from "../../../api/axios";
import { CustomerResponse, RegisterCustomerRequest, UpdateCustomerRequest } from "../types/CustomerTypes"


// Obtener todos los customers
export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
  const response = await API.get("/sales/customer/all");
  return response.data;
};

// Registrar Cliente
export const registerCustomer = async (
  data: RegisterCustomerRequest
): Promise<void> => {
  await API.post("/sales/customer/register", data);
};

// Obtener Customer por Id
export const getCustomerById = async (id: string): Promise<CustomerResponse> => {
  const response = await API.get(`sales/customer/${id}`);
  return response.data;
};

// Modificar customer 
export const updateCustomer = async (customer: UpdateCustomerRequest): Promise<void> => {
    await API.put(`/sales/customer/update/${customer.id}`, customer);
}