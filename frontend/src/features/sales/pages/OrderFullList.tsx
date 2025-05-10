import { useState } from "react";
import { format } from "date-fns";
import { MockOrders } from "../data/MockOrders";
import { OrderProps } from "../components/Order";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import '../styles/OrderFullList.css';

import {
  CalendarDays,
  Package,
  User,
  Phone,
  Mail,
  Home,
  Building,
  ShoppingCart,
  BadgeCheck,
  FileText,
} from "lucide-react";

export const OrderFullList = () => {
  const [searchId, setSearchId] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");

  const filteredOrders = MockOrders.filter((order: OrderProps) => {
    const matchesId = order.id.toLowerCase().includes(searchId.toLowerCase());
    const text = searchCustomerName.toLowerCase();
    const matchesCustomerName = order.cliente.toLowerCase().includes(text);
    return matchesId && matchesCustomerName;
  });

  return (
    <div className="min-h-screen bg-red-50 p-6">
      <Header />
      <h2 className="text-center text-2xl font-bold text-red-800 mb-6">
        Listado de Pedidos Completos
      </h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por Número de Pedido"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 shadow-sm"
          id="Buscador"
        />

        <input
          type="text"
          placeholder="Buscar por Nombre del Cliente"
          value={searchCustomerName}
          onChange={(e) => setSearchCustomerName(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 shadow-sm"
          id="Buscador"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-100 text-red-800 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  Fecha Pedido
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Fecha Entrega
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Cliente
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Correo
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Dirección
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  Tipo Local
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Productos
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  Estado
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Comprobante
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: OrderProps) => (
              <tr
                key={order.id}
                className="border-t border-gray-200 hover:bg-red-50 transition-colors"
              >
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">
                  {format(new Date(order.fechaPedido), "yyyy-MM-dd")}
                </td>
                <td className="px-4 py-3">
                  {format(new Date(order.fechaEntrega), "yyyy-MM-dd")}
                </td>
                <td className="px-4 py-3">{order.cliente}</td>
                <td className="px-4 py-3">{order.telefono}</td>
                <td className="px-4 py-3">{order.correoelectronico}</td>
                <td className="px-4 py-3">{order.direccion}</td>
                <td className="px-4 py-3">{order.tipoLocal}</td>
                <td className="px-4 py-3">
                  <ul className="list-disc list-inside">
                    {order.productos.map((producto, index) => (
                      <li key={index}>
                        {producto.nombre} - {producto.cantidad} x {producto.embalaje}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">{order.estado}</td>
                <td className="px-4 py-3">
                  {order.comprobante_p ? (
                    <Link
                      to={order.comprobante_p}
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                    >
                      Ver
                    </Link>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderFullList;

