import type { BillingTimeProcess } from "../../../../billingmanager/types/BillingTimeProcessType";

type Props = {
  data: BillingTimeProcess[];
};

const OrderBilledTable: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No hay datos para mostrar</p>;
  }

  return (
    <div className="overflow-x-auto rounded shadow bg-white mt-6">
      <table className="w-full border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Pedido ID</th>
            <th className="px-4 py-2">Fecha Pedido</th>
            <th className="px-4 py-2">Fecha Factura</th>
            <th className="px-4 py-2">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.OrderId}>
              <td className="px-4 py-2">{row.OrderId}</td>
              <td className="px-4 py-2">{row.dateOrder}</td>
              <td className="px-4 py-2">{row.dateBilling}</td>
              <td className="px-4 py-2">{row.TimeProcess}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBilledTable;
