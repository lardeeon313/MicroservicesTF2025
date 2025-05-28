import { customerSatisfactionColors } from "../../../../utils/customerSatisfactionColors";
import { CustomerSatisfactionLabel } from "../../constants/CustomerSatisfactionLabel";
import { CustomerSatisfaction } from "../../types/CustomerTypes";


type Props = {
  status: CustomerSatisfaction 
}

export const CustomerSatisfactionBadge = ({ status }: Props) => {
  const styles = customerSatisfactionColors[status]

  if (!styles) {
    return (
      <span className="px-2 py-1 text-sm font-medium rounded-xl text-gray-600 bg-gray-200">
        Estado desconocido
      </span>
    );
  }

  const { text, bg } = styles;
  const label = CustomerSatisfactionLabel[status] ?? status;

  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-xl ${text} ${bg}`}>
      {label}
    </span>
  )
}