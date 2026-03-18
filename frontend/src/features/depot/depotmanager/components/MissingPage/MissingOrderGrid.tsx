import MissingOrderCard from "./MissingOrderCard";
import { DepotOrderMissingDto, OrderStatus } from "../../types/OrderTypes";
import EmptyState from "../../../../../components/EmptyState";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Pagination } from "../../../../../components/Pagination";

const ITEMS_PER_PAGE = 9;

interface Props {
  orders: DepotOrderMissingDto[];
  onView: (order: DepotOrderMissingDto) => void;
  onReport: (order: DepotOrderMissingDto) => void;
}

export default function MissingOrdersGrid({ orders, onView, onReport }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return orders.slice(start, start + ITEMS_PER_PAGE);
  }, [orders, safePage]);

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedOrders.map((order) => (
          <MissingOrderCard
            key={order.depotOrderId}
            order={order}
            onView={onView}
            onReport={onReport}
            showReportButton={order.depotOrder.status === OrderStatus.MissingProduct}
          />
        ))}
      </div>
        {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        )}
    </div>
  );
}
