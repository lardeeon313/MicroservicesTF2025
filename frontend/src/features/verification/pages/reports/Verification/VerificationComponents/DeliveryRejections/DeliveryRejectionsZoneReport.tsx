import React from "react";
import { MapPin } from "lucide-react";
import { DeliveryRejectionReport } from "../../../../../types/Report";
import { AlertTriangle } from "lucide-react";

interface Props {
  data: DeliveryRejectionReport[];
}

const DeliveryRejectionsZoneReport: React.FC<Props> = ({ data }) => {
   console.log("📄 Datos recibidos en DeliveryRejectionsTable:", data);
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">
            No se registraron zonas con rechazos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Encabezado atractivo */}
      <div className="flex items-center justify-between bg-gradient-to-r from-red-100 to-gray-200 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Zonas Asignadas
          </h2>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 border-gray-300 bg-gray-50 text-gray-700">
            Total: {data.length} registros
        </span>
      </div>

      {/* Tabla */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID de Zona
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Zona
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.deliveryZoneId || item.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.deliveryZoneId || "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.deliveryZoneName || "Sin zona asignada"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryRejectionsZoneReport;
