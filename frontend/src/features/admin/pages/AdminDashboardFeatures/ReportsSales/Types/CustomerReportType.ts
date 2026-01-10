// types/CustomerReport.ts
export interface AdminCustomerReportItem {
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  orderCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CustomerReportFilters {
  name?: string;
  email?: string;
  minOrders?: number;
  page: number;
  pageSize: number;
}
