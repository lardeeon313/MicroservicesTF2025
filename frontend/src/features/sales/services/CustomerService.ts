import API from "../../../api/axios";
import { CustomerResponse, RegisterCustomerRequest, UpdateCustomerRequest } from "../types/CustomerTypes"


// Obtener todos los clientes 
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

// Obtener Cliente por Id
export const getCustomerById = async (id: string): Promise<CustomerResponse> => {
  const response = await API.get(`sales/customer/${id}`);
  return response.data;
};

// Modificar Cliente 
export const updateCustomer = async (customer: UpdateCustomerRequest): Promise<void> => {
    await API.put(`/sales/customer/update/${customer.id}`, customer);
};

// Eliminar Cliente
export const deleteCustomer = async (id: string): Promise<void> => {
  await API.delete(`/sales/customer/${id}`)
};

// Paginado de Customers
export const getPagedCustomers = async (page: number, pageSize:number) => {
  const response = await API.get("/sales/customer/paged", {
    params: { pageNumber: page, pageSize},
  });

  return response.data as {
    totalCount: number,
    totalPages: number,
    currentPage: number,
    customers: CustomerResponse[];
  };
};

