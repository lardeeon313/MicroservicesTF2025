// Definimos el tipo de una orden
export type DeliveryOrderTypeDto = {
  id: number;
  customer: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  payment: string;
  priority: string;
};

