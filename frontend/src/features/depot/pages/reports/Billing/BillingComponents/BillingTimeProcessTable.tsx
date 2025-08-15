import React from "react";

interface ProcessingTimeOrder {
  orderId: string;
  averageProcessingTime: number;
}

type Props = {
  data: ProcessingTimeOrder[];
};

const ProcessingTimeOrderTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID Orden</th>
            <th className="px-4 py-2 text-left">Tiempo Promedio (min)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-2">{item.orderId}</td>
              <td className="px-4 py-2">{item.averageProcessingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessingTimeOrderTable;
