import React from "react";
//import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";
import { LogisticOrder } from "../../../types/DeliveryOrderTypeDto";

type Props = {
  orders: LogisticOrder[];
};

export default function MapWithDirections({ orders }: Props) {
  if (!orders.length) return null;

  const first = orders[0];
  const lat = first.deliveryAddress.latitude;
  const lng = first.deliveryAddress.longitude;

  return (
    <iframe
      width="100%"
      height="100%"
      style={{ border: 0, borderRadius: 16 }}
      loading="lazy"
      src={`https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
    />
  );
}
