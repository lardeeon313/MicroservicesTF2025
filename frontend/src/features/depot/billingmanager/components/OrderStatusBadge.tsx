import { orderStatusStyles } from "../../../../utils/orderStatusColors"

type Props = {
  status: string;
}

export const OrderStatusBadge = ({ status }: Props) => {
  let label = status;
  let styleKey: string | number = status;

  if (status === 'Pendiente' || status === 'Emitido' || String(status) === '0') {
    label = 'Pendiente';
    styleKey = 'pending';
  } else if (status === 'Asignado' || String(status) === '2') {
    label = 'Asignado';
    styleKey = 'confirmed';
  } else if (status === 'En Preparación' || String(status) === '3') {
    label = 'En Preparación';
    styleKey = 'inPreparation';
  } else if (status === 'Preparado' || String(status) === '7') {
    label = 'Preparado';
    styleKey = 'prepared';
  } else if (status === 'Facturado' || String(status) === '8') {
    label = 'Facturado';
    styleKey = 'invoiced';
  }

  const styles = orderStatusStyles[styleKey as keyof typeof orderStatusStyles];

  if (!styles) {
    return (
      <span className="px-2 py-1 text-sm font-medium rounded-xl text-gray-600 bg-gray-200">
        {label}
      </span>
    );
  }

  const { text, bg } = styles;
  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-xl ${text} ${bg}`}>
      {label}
    </span>
  )
}
