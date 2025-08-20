import React from "react";

export type ArmTime = {
    id: number;
  orderId: number;
  oldStatus: number;
  newStatus: number;
  changedAt: string;
  averageDuration: number;
};

type Props = {
  armTime: ArmTime[];
};

const AverageTimeOrderTable: React.FC<Props> = ({ armTime }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Pedido ID</th>
            <th className="px-4 py-2 text-left">Estado Anterior</th>
            <th className="px-4 py-2 text-left">Estado Nuevo</th>
            <th className="px-4 py-2 text-left">Fecha de Cambio</th>
            <th className="px-4 py-2 text-left">Duración Promedio</th>
          </tr>
        </thead>
        <tbody>
          {armTime.map((item, indx) => (
            <tr
              key={indx}
              className={indx % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.orderId}</td>
              <td className="px-4 py-2">{item.oldStatus}</td>
              <td className="px-4 py-2">{item.newStatus}</td>
              <td className="px-4 py-2">
                {new Date(item.changedAt).toLocaleString()}
              </td>
              <td className="px-4 py-2">{item.averageDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AverageTimeOrderTable;
