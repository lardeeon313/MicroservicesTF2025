import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { BillingTimeProcess } from "../../../../billingmanager/types/BillingTimeProcessType";

type Props = {
  data: BillingTimeProcess[];
};

const OrderBilledGraph: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div className="h-64 mt-6 bg-white rounded shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="OrderId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="TimeProcess" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderBilledGraph;
