import { customerStatusColors } from "../../../../utils/customerStatusColors";
import { CustomerStatusLabel } from "../../constants/CustomerStatusLabel";
import { CustomerStatus } from "../../types/CustomerTypes";


type Props = {
  status: CustomerStatus
}

export const CustomerStatusBadge = ({ status }: Props) => {
  const styles = customerStatusColors[status]

  if (!styles) {
    return (
      <span className="px-2 py-1 text-sm font-medium rounded-xl text-gray-600 bg-gray-200">
        Estado desconocido
      </span>
    );
  }

  const { text, bg } = styles;
  const label = CustomerStatusLabel[status] ?? status;

  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-xl ${text} ${bg}`}>
      {label}
    </span>
  )
}