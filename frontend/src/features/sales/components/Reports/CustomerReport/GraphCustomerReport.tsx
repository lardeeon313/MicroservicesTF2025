// src/features/sales/components/GraphCustomerReport.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomerWithCount } from "../../../types/CustomerTypes";

type Props = {
  data: CustomerWithCount[];
};

const GraphCustomerReport: React.FC<Props> = ({ data }) => (
    
  <div className="max-w-full mt-20 h-96 mb-14">
    <h1 className="text-center text-2xl font-bold text-red-600 mb-6">
      Cantidad de pedidos realizados por cliente
    </h1>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fullName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orderCount" fill="#AA2222" className="opacity-90" />
        </BarChart>   
        </ResponsiveContainer>
    </div>

);

export default GraphCustomerReport;
