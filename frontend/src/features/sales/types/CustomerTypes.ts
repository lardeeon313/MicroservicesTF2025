// Representa el modelo completo del cliente en base de datos
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  
  registrationDate: string; // ISO string
  status: CustomerStatus;
  descriptionsatisfaction: string;
  //
  satisfactionScore?: number;
  addresses: Address[];
  isActive: boolean;
}


export interface Address{
  id: number; 
  street: string;
  number: number;
  apartment?: string;
  city:string;
  province:string;
  country:string;
  postalCode:string;
  latitude:number;
  longitude:number;
  formattedAddress?:string; 
  createdAt:string;
  customerId: string; // Guid → string
  customer?: Customer;
}

//Request que se comunicara con el service: 

export interface AddressRequest {
  street: string;
  number: string;
  apartment?: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

//estado del cliente , si este perdido inactivo y perdido: 
export enum CustomerStatus {
  Active = "Active",
  Inactive = "Inactive",
  Lost = "Lost"
}


// Representa la respuesta que devuelve la API al obtener un cliente
export interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: Address[];
  status: CustomerStatus;
}

// Para el formulario de registro de cliente
export interface RegisterCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: AddressRequest[];
}

// Para el formulario de actualización de cliente
export interface UpdateCustomerRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  addresses: AddressRequest[];
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


// --------------TypesReports----------------------

export interface CustomerWithCount extends CustomerResponse {
  fullName: string;
  orderCount: number;
  satisfaction?: CustomerSatisfaction
}

export enum CustomerSatisfaction {
  Positiva = "Positiva",
  Negativa = "Negativa",
  Neutra = "Neutra"
}

//----------Reports Billing 

export interface CustomerIncome{
  id: Customer['id']
  FirstName : Customer['firstName']
  LastName : Customer['lastName']
  TotalIncome : number
}


