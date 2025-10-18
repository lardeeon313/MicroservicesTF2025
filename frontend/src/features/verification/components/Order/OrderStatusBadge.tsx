import { OrderStatus } from '../../types/OrderTypes';
import { OrderStatusLabels } from '../../constants/OrderStatusLabel';
import { normalizeOrderStatus } from '../../utils/normalize';
import { getOrderStatusBadgeColor } from '../../utils/ui';

interface OrderStatusBadgeProps {
  status: OrderStatus | string | number;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const normalized = normalizeOrderStatus(status);
  const color = getOrderStatusBadgeColor(normalized);
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {normalized !== undefined ? OrderStatusLabels[normalized] : String(status)}
    </span>
  );
};
