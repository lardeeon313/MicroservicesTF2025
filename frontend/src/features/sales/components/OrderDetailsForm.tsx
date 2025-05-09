"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MockOrders } from "../data/MockOrders"
import type { OrderProps } from "../components/Order"
//import { EditOrderForm } from "../update/EditOrderForm"

// Función para formatear Date a string legible
const formatDate = (date: Date): string => {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para formatear precio
const formatPrice = (price: number): string => {
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  })
}

export const OrderDetailsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const updatedOrder = location.state?.updatedOrder
  const [order, setOrder] = useState<OrderProps | null>(null)
  const [showEditModal,setshowEditModal] = useState(false)

  useEffect(() => {
    if (updatedOrder) {
      setOrder(updatedOrder)
    } else if (id) {
      const foundOrder = MockOrders.find((o) => o.id === id)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [id, updatedOrder])

  const title = id ? `Detalle del pedido #${id}` : "Detalle del pedido"

  const handleUpdateClick = () => {
    if(order){
      setshowEditModal(true);
    }
  }

  //para mostrar los pedidos realmente actualizados 
  const handleSaveChanges = (updatedOrder:OrderProps) => {
    setOrder(updatedOrder);
  }

  const handleDeleteClick = () => {
    if (window.confirm("¿Estás seguro de que querés eliminar este pedido?")) {
      alert(`Pedido ${id} eliminado (simulado).`)
      // Acá iría la lógica para eliminar el pedido
      navigate("/sales/listado")
    }
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Cargando pedido...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Cliente</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none bg-gray-50"
            disabled
            value={order.cliente || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Estado</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none bg-gray-50"
            disabled
            value={order.estado || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Detalles de entrega</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none resize-none h-24 bg-gray-50"
            disabled
            value={order.detalleDeEntrega || ""}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Información adicional</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Dirección:</p>
              <p className="text-sm">{order.direccion || "No especificada"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Tipo de local:</p>
              <p className="text-sm">{order.tipoLocal || "No especificado"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Fecha del pedido:</p>
              <p className="text-sm">{order.fechaPedido ? formatDate(order.fechaPedido) : "No especificada"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Fecha de entrega:</p>
              <p className="text-sm">{order.fechaEntrega ? formatDate(order.fechaEntrega) : "No especificada"}</p>
            </div>

            {order.montoTotal && (
              <div>
                <p className="text-sm font-medium text-gray-600">Monto total:</p>
                <p className="text-sm font-semibold">{formatPrice(order.montoTotal)}</p>
              </div>
            )}

            {order.comprobante_p && (
              <div>
                <p className="text-sm font-medium text-gray-600">Comprobante:</p>
                <p className="text-sm text-blue-600 hover:underline cursor-pointer">{order.comprobante_p}</p>
              </div>
            )}
          </div>
        </div>

        {order.productos && order.productos.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Productos:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {order.productos.map((producto, index) => (
                <li key={index} className="text-sm">
                  {producto.nombre} - {producto.cantidad} {producto.embalaje}(s) -{" "}
                  {formatPrice(producto.montoPorProducto)} c/u
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={handleUpdateClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded cursor-pointer"
        >
          Actualizar Pedido
        </button>

        <button
          onClick={handleDeleteClick}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded cursor-pointer"
        >
          Eliminar Pedido
        </button>
      </div>

      <div className="bg-red-700 text-white p-3 rounded text-center mt-4">
        <h2 className="font-semibold mb-2">En caso de presenciar algún faltante:</h2>
        <button className="w-full bg-white text-red-700 font-semibold py-2 rounded hover:bg-gray-100 transition">
          Emitir Faltante
        </button>
      </div>

    </div>
  )
}

export default OrderDetailsForm
