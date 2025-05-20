// Representa el modelo completo del cliente en base de datos
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  registrationDate: string; // ISO string
}

// Representa la respuesta que devuelve la API al obtener un cliente
export interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Para el formulario de registro de cliente
export interface RegisterCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Para el formulario de actualización de cliente
export interface UpdateCustomerRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

// Get: CustomerPaginated 
export type GetCustomersPaginatedParams = {
  page: number, 
  pageSize: number; 
  search?: string
}

export type GetCustomersPaginatedResponse = {
  data: CustomerResponse[];
  totalCount: number;
};





