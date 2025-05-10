import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MockOrders } from "../data/MockOrders";
import { OrderProps } from "../components/Order";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { BusinessRules } from "./BusinessRules/BusinessRules";
import { OrderStatus } from "../components/Order";
import { FaMapMarkerAlt, FaStore, FaCalendarAlt, FaReceipt } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import '../styles/OrderDetailsPage.css'

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<OrderProps | null>(null);
  const [cliente, setCliente] = useState("");
  const [estado, setEstado] = useState("");
  const [detalles, setDetalles] = useState("");
  const [comprobante, setComprobante] = useState<File | null>(null);
  const Navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setComprobante(file);
    if (file) {
      Swal.fire({
        icon: "success",
        title: "Comprobante cargado",
        text: `Se subió correctamente: ${file.name}`,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const IssueAlert = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción enviará una alerta por faltante",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, emitir alerta",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Alerta emitida", "Se notificó el faltante", "success");
      }
    });
  };

  useEffect(() => {
    if (!id) return;
    const encontrado = MockOrders.find((p) => p.id === id);
    if (encontrado) {
      setPedidoSeleccionado(encontrado);
      setCliente(encontrado.cliente);
      setEstado(encontrado.estado);
    }
  }, [id]);

  if (!pedidoSeleccionado) return <p className="p-6 text-gray-600">Cargando pedido...</p>;

  const {
    direccion,
    tipoLocal,
    productos,
    fechaPedido,
    fechaEntrega,
    comprobante_p,
    montoTotal,
    detalleDeEntrega
  } = pedidoSeleccionado;

  const handleEliminar = () => {
    alert(`Pedido ${id} eliminado`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center border-b pb-4 fade-in">Gestión del pedido</h2>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Cliente</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Estado</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Detalles del pedido</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              placeholder="Agregar detalles"
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <BusinessRules estado={estado as OrderStatus} actionType="update">
              <button
                onClick={() => Navigate(`/sales/editar/${id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
              >
                <FaEdit className="text-white" />
                Actualizar Pedido
              </button>
            </BusinessRules>
            <BusinessRules estado={estado as OrderStatus} actionType="delete">
              <button
                onClick={handleEliminar}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                <FaTrashAlt className="text-white" />
                Eliminar Pedido
              </button>
            </BusinessRules>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-6">
            <p><FaMapMarkerAlt className="inline mr-2 text-red-400" /><strong>Dirección:</strong> {direccion}</p>
            <p><FaStore className="inline mr-2 text-red-400" /><strong>Tipo de local:</strong> {tipoLocal}</p>
            <p><FaCalendarAlt className="inline mr-2 text-red-400" /><strong>Fecha del pedido:</strong> {fechaPedido.toLocaleDateString()}</p>
            <p><FaCalendarAlt className="inline mr-2 text-red-400" /><strong>Fecha de entrega:</strong> {fechaEntrega.toLocaleDateString()}</p>
            <p><FaReceipt className="inline mr-2 text-red-400" /><strong>Comprobante:</strong> {comprobante_p}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 mt-6">Productos</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Embalaje</th>
                    <th className="px-4 py-2">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id} className="border-t">
                      <td className="px-4 py-2">{prod.nombre}</td>
                      <td className="px-4 py-2">{prod.cantidad}</td>
                      <td className="px-4 py-2">{prod.embalaje}</td>
                      <td className="px-4 py-2">${prod.montoPorProducto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subir comprobante
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={IssueAlert}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
            >
              Emitir alerta por faltante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

