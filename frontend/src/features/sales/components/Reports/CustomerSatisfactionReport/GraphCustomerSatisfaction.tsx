import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { CustomerSatisfaction, CustomerWithCount } from "../../../types/CustomerTypes";

interface Props {
  customers: CustomerWithCount[];
}

const classifySatisfaction = (text?: string): CustomerSatisfaction => {
  if (!text || text.trim() === "") return CustomerSatisfaction.Neutra;

  const lower = text.toLowerCase().trim();
  const positivas = ["buena", "positiva", "excelente", "amable", "rápida", "satisfecho"];
  const negativas = ["mala", "negativa", "poca", "insatisfecho", "tarde", "demora"];

  if (positivas.some((p) => lower.includes(p))) return CustomerSatisfaction.Positiva;
  if (negativas.some((n) => lower.includes(n))) return CustomerSatisfaction.Negativa;

  return CustomerSatisfaction.Neutra;
};

export const GraphSatisfactionCustomer: React.FC<Props> = ({ customers }) => {
  const stats = { Positiva: 0, Negativa: 0, Neutra: 0 };

  customers.forEach((c) => {
    const tipo = classifySatisfaction(c.satisfaction ?? "");
    stats[tipo]++;
  });

  const data = [
    { tipo: "Positiva", cantidad: stats.Positiva },
    { tipo: "Negativa", cantidad: stats.Negativa },
    { tipo: "Neutra", cantidad: stats.Neutra },
  ];

  // Colores por tipo
  const COLORS: Record<string, string> = {
    Positiva: "#22c55e", // verde
    Negativa: "#ef4444", // rojo
    Neutra: "#facc15", // amarillo
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { tipo, cantidad } = payload[0].payload;
      return (
        <div
          className="p-2 rounded-lg shadow-md text-white"
          style={{ backgroundColor: COLORS[tipo] }}
        >
          <p className="font-semibold">{tipo}</p>
          <p>{`Cantidad: ${cantidad}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
  <div className="max-w-full mt-20 mb-14">
    {/* Header con gradiente y línea decorativa */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
        Clasificación de Comentarios
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-2"></div>
      <p className="text-gray-600 text-sm">Análisis de sentimientos por categoría</p>
    </div>

    {/* Container del gráfico con diseño premium */}
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Decoración superior */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full">
          <span className="text-sm text-blue-700 font-medium">
            💬 Análisis de Sentimientos
          </span>
        </div>
      </div>

      {/* Gráfico mejorado con mayor altura */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          barSize={100}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          className="drop-shadow-sm"
        >
          <defs>
            {/* Gradientes para diferentes tipos */}
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#34D399" stopOpacity={0.7}/>
            </linearGradient>
            
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#F87171" stopOpacity={0.7}/>
            </linearGradient>
            
            <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B7280" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.7}/>
            </linearGradient>
            
            {/* Sombra para las barras */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.25"/>
            </filter>
          </defs>
          
          {/* Líneas de referencia mejoradas */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f1f5f9" 
            opacity={0.8}
            vertical={false}
          />

          <XAxis 
            dataKey="tipo" 
            tick={{ fontSize: 14, fill: '#4B5563', fontWeight: '500' }}
            axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          
          <YAxis 
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          />
          
          <Bar 
            dataKey="cantidad" 
            radius={[12, 12, 0, 0]}
            filter="url(#shadow)"
            className="hover:opacity-80 transition-opacity duration-200"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.tipo]}
                stroke={COLORS[entry.tipo]}
                strokeWidth={2}
                style={{
                  filter: 'brightness(1.1)'
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
