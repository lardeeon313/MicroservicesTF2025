import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid, 
} from "recharts";
import { OperatorProductivityReport } from "../../../../types/Report";

interface Props {
  data: OperatorProductivityReport[];
}

// Tooltip personalizado y elegante
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        padding: '16px',
        minWidth: '220px'
      }}>
        <p style={{
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '12px',
          fontSize: '15px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '8px'
        }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }} />
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: 500 }}>
                {entry.name}
              </span>
            </div>
            <span style={{ fontWeight: 'bold', color: '#1f2937', marginLeft: '16px', fontSize: '14px' }}>
              {entry.value}
            </span>
          </div>
        ))}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '8px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <span style={{ color: '#374151', fontWeight: 600, fontSize: '14px' }}>Total</span>
          <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '15px' }}>{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Leyenda personalizada


export const GraphOperatorProductivity: React.FC<Props> = ({ data }) => {
  if (data.length === 0 || !data) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sin pedidos
          </h2>
          <p className="text-gray-500 text-sm">
            No se encontraron pedidos para las fechas o filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Productividad de Operadores
        </h3>
        <p className="text-sm text-gray-500">
          Órdenes por operador - Rendimiento general
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={8}
        >
          <defs>
            <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
            </linearGradient>
            <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
            </linearGradient>
          </defs>
          
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false}
            opacity={0.5}
          />
          
          <XAxis 
            dataKey="operatorId" 
            stroke="#6b7280"
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
          />
          
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 8 }}
          />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: 500
            }}
            iconType="square"
            iconSize={14}
            formatter={(value) => <span style={{ color: '#374151', marginLeft: '4px' }}>{value}</span>}
          />
          
          <Bar 
            dataKey="deliveredOrders" 
            fill="#10b981"
            name="Entregadas"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          
          <Bar 
            dataKey="rejectedOrders" 
            fill="#ef4444"
            name="Rechazadas"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          
          <Bar 
            dataKey="pendingOrders" 
            fill="#f59e0b"
            name="Pendientes"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};