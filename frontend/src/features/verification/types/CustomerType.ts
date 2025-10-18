import { LogisticAddressDto } from './Address';

export interface LogisticCustomerDto {
  id: string; // GUID as string
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  registrationDate: string; // ISO date string
  addresses: LogisticAddressDto[];
  status: string;
}