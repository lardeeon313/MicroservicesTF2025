import type { Customer } from "../../../types/CustomerTypes";
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

export interface CustomerWithCount extends Customer{
   orderCount: number; 
}

type Props = {
  data: CustomerWithCount[];
}

const GraphCustomerReport: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-96 mt-8">
      <h1 className="text-blue-800 text-1xl font-bold">Cantidad de pedidos realizado por cliente segun el grafico </h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fullName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orderCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCustomerReport;
