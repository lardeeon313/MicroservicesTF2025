import { CustomerStatus } from "../../../../../sales/types/CustomerTypes";

export interface CustomerStatusReportDto {
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  orderCount: number;
  status: CustomerStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface GetCustomerStatusReportRequest {
  name?: string;
  email?: string;
  status?: CustomerStatus;
  page: number;
  pageSize: number;
}