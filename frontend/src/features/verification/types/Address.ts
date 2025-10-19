export interface LogisticAddressDto {
  id: number;
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