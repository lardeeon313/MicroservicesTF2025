import { useState } from "react";
import { format } from "date-fns";
import { MockOrders } from "../data/MockOrders";
import { OrderProps } from "../components/Order";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export const OrderFullList = () => {
  const [searchId, setSearchId] = useState("");
  //const [searchDate, setSearchDate] = useState("");
  const [searchCustomerName,setSearchCustomerName] = useState("");

  const filteredOrders = MockOrders.filter((order: OrderProps) => {
    const matchesId = order.id.toLowerCase().includes(searchId.toLowerCase());
    const text = searchCustomerName.toLowerCase();
    const formattedDate = format(new Date(order.fechaPedido), "yyyy-MM-dd");
    //const matchesDate = searchDate === "" || formattedDate.includes(searchDate);
    const matchesCustomerName = order.cliente
      .toLowerCase()
      .includes(text);
    return matchesId && matchesCustomerName;
  });

  return (
    <div className="min-h-screen bg-red-100 p-4">
        <Header/>
      <h2 className="text-center text-xl font-bold text-red-800 mb-4">Listado de Pedidos Completos</h2>

      {/* Buscadores */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por Numero"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        
        <input 
          type="text" 
          placeholder="Buscar por Nombre de cliente"
          value={searchCustomerName}
          onChange={(e) => setSearchCustomerName(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2"
         />
        
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border border-red-300">
          <thead className="bg-red-200 text-red-800 font-semibold text-sm">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Fecha Pedido</th>
              <th className="border px-2 py-2">Fecha Entrega</th>
              <th className="border px-2 py-2">Cliente</th>
              <th className="border px-2 py-2">Telefono</th>
              <th className="border px-2 py-2">Correo Electronico</th>
              <th className="border px-2 py-2">Dirección</th>
              <th className="border px-2 py-2">Tipo Local</th>
              <th className="border px-2 py-2">Productos</th>
              <th className="border px-2 py-2">Estado</th>
              <th className="border px-2 py-2">Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: OrderProps) => (
              <tr key={order.id} className="text-sm text-center hover:bg-red-50">
                <td className="border px-2 py-2">{order.id}</td>
                <td className="border px-2 py-2">{format(new Date(order.fechaPedido), "yyyy-MM-dd")}</td>
                <td className="border px-2 py-2">{format(new Date(order.fechaEntrega), "yyyy-MM-dd")}</td>
                <td className="border px-2 py-2">{order.cliente}</td>
                <td className="border px-2 py-2">{order.telefono}</td>
                <td className="border px-2 py-2">{order.correoelectronico}</td>
                <td className="border px-2 py-2">{order.direccion}</td>
                <td className="border px-2 py-2">{order.tipoLocal}</td>
                <td className="border px-2 py-2">
                  <ul className="list-disc list-inside">
                  {order.productos.map((producto, index) => (
                        <li key={index}>
                            {producto.nombre} - {producto.cantidad} x {producto.embalaje}
                        </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-2">{order.estado}</td>
                
                <td className="border px-2 py-2">
                  {order.comprobante_p ? (
                    <Link to={order.comprobante_p} className="text-blue-600 underline" target="_blank">Ver</Link>
                  ) : (
                    "—"
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