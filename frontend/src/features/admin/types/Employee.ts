export enum EmployeeRole {
  DepotManager = 'DepotManager',
  DepotOperator = 'DepotOperator',
  BillingManager = 'BillingManager',
  SalesStaff = 'SalesStaff',
  DeliveryOperator = 'DeliveryOperator',
  VerificationManager = 'VerificationManager',
  Admin = 'Admin',
}

export enum EmployeeSector {
  Administration = 'Administration',
  Sales = 'Sales',
  Warehouse = 'Warehouse',
  Delivery = 'Delivery',
  Verification = 'Verification',
  Billing = 'Billing',
}

export enum EmployeeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  OnLicense = 'OnLicense',
  Dismissed = 'Dismissed',
  ResignationProcess = 'ResignationProcess',
  Vacation = 'Vacation',
}

export interface EmployeeDto {
  id?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  sector: EmployeeSector;
  createdAt?: string;
}

export interface RegisterEmployeeRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  sector: EmployeeSector;
}

export interface UpdateEmployeeRequest {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  sector: EmployeeSector;
}
