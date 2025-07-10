import React from "react";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,} from "recharts";
import type { CustomerIncome } from "../../../../../sales/types/CustomerTypes";

type Props = {
  data: {
    CustomerID: CustomerIncome['id'];
    TotalIncome: CustomerIncome['TotalIncome']
 }[];
};

const GraphBillingTimeProcess: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Ingresos por Cliente</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CustomerID" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalIncome" name="Total Ingresos" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphBillingTimeProcess;
