import MissingOrderCard from "./MissingOrderCard";
import { DepotOrderMissingDto, OrderStatus } from "../../types/OrderTypes";
import EmptyState from "../../../../../components/EmptyState";
import { AlertCircle } from "lucide-react";

interface Props {
  orders: DepotOrderMissingDto[];
  onView: (order: DepotOrderMissingDto) => void;
  onReport: (order: DepotOrderMissingDto) => void;
}

export default function MissingOrdersGrid({ orders, onView, onReport }: Props) {
  if (orders.length === 0) {
    return (
        <EmptyState
            icon={AlertCircle}
            title="No Hay Órdenes con Faltantes"
            description="Actualmente no hay órdenes con productos faltantes."
            actionLabel="Actualizar"
            onAction={() => window.location.reload()}
        />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <MissingOrderCard
          key={order.depotOrderId}
          order={order}
          onView={onView}
          onReport={onReport}
          showReportButton={order.depotOrder.status === OrderStatus.MissingProduct}
        />
      ))}
    </div>
  );
}
