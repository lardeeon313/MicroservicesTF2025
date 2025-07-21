import { OrderStatus } from "../../depotmanager/types/OrderTypes"
import { orderStatusStyles } from "../../../../utils/orderStatusColors"
import { OrderStatusLabels } from "../../depotmanager/constants/OrderStatusLabel"

type Props = {
  status: OrderStatus
}

export const OrderStatusBadge = ({ status }: Props) => {
  const styles = orderStatusStyles[status]

  if (!styles) {
    return (
      <span className="px-2 py-1 text-sm font-medium rounded-xl text-gray-600 bg-gray-200">
        Estado desconocido
      </span>
    );
  }

  const { text, bg } = styles;
  const label = OrderStatusLabels[status] ?? status;

  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-xl ${text} ${bg}`}>
      {label}
    </span>
  )
}
