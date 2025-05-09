"use client"

import type React from "react"
import { useState } from "react"
import Swal from "sweetalert2"
import { v4 as uuidv4 } from "uuid"
import type { OrderProps, ProductoProps } from "../../components/Order"
import Header from "../../components/Header"

//código para actualizar PEDIDO, desde la pestaña de Listado de Pedidos

interface Props {
  pedidoOriginal: OrderProps
}

export const UpdateOrderPage: React.FC<Props> = ({ pedidoOriginal }) => {
  const [pedido, setPedido] = useState<OrderProps>({ ...pedidoOriginal })
  const [pedidoModificado, setPedidoModificado] = useState<OrderProps | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPedido((prev) => ({
      ...prev,
      [name]: name.includes("fecha") ? new Date(value) : value,
    }))
  }

  const handleProductChange = (index: number, field: keyof ProductoProps, value: string | number) => {
    const updatedProducts = pedido.productos.map((prod, i) =>
      i === index
        ? { ...prod, [field]: field === "cantidad" || field === "montoPorProducto" ? Number(value) : value }
        : prod,
    )
    setPedido((prev) => ({ ...prev, productos: updatedProducts }))
  }

  //en caso de que se quiera agregar más productos al pedido
  const handleAddProduct = () => {
    const nuevoProducto: ProductoProps = {
      id: uuidv4(),
      nombre: "",
      cantidad: 0,
      embalaje: "",
      montoPorProducto: 0,
    }
    setPedido((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto],
    }))
  }

  //en caso de que se quieran eliminar productos del pedido incluso después de emitirlo
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = pedido.productos.filter((_, i) => i !== index)
    setPedido((prev) => ({ ...prev, productos: updatedProducts }))
  }

  const handleUpdatePedido = () => {
    setPedidoModificado(pedido)
    Swal.fire("¡Actualizado!", "El pedido fue modificado exitosamente.", "success")
  }

  // Calcular el monto total
  const calcularMontoTotal = () => {
    return pedido.productos.reduce((total, prod) => total + prod.cantidad * prod.montoPorProducto, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Actualizar pedido
            </h2>
            <p className="text-blue-100 mt-1">
              Cliente: <span className="font-semibold">{pedido.cliente}</span>
            </p>
          </div>

          <div className="p-6">
            {/* Información general */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Información general
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={pedido.direccion}
                    onChange={handleChange}
                    placeholder="Dirección de entrega"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de local</label>
                  <input
                    type="text"
                    name="tipoLocal"
                    value={pedido.tipoLocal}
                    onChange={handleChange}
                    placeholder="Tipo de local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pedido</label>
                  <input
                    type="date"
                    name="fechaPedido"
                    value={pedido.fechaPedido.toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
                  <input
                    type="date"
                    name="fechaEntrega"
                    value={pedido.fechaEntrega.toISOString().split("T")[0]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante</label>
                  <input
                    type="text"
                    name="comprobante_p"
                    value={pedido.comprobante_p ?? ""}
                    onChange={handleChange}
                    placeholder="Número de comprobante"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Productos</h3>
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar producto
                </button>
              </div>

              {/* Encabezados de columnas */}
              <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-gray-700 px-2">
                <div className="col-span-4">Nombre</div>
                <div className="col-span-2">Cantidad</div>
                <div className="col-span-2">Embalaje</div>
                <div className="col-span-2">Precio unitario</div>
                <div className="col-span-2">Acciones</div>
              </div>

              {/* Lista de productos */}
              <div className="space-y-3">
                {pedido.productos.map((prod, index) => (
                  <div key={prod.id} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-lg">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={prod.nombre}
                        onChange={(e) => handleProductChange(index, "nombre", e.target.value)}
                        placeholder="Nombre del producto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={prod.cantidad}
                        onChange={(e) => handleProductChange(index, "cantidad", e.target.value)}
                        placeholder="Cantidad"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={prod.embalaje}
                        onChange={(e) => handleProductChange(index, "embalaje", e.target.value)}
                        placeholder="Tipo de embalaje"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={prod.montoPorProducto}
                        onChange={(e) => handleProductChange(index, "montoPorProducto", e.target.value)}
                        placeholder="Precio unitario"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de totales */}
              <div className="mt-6 flex justify-end">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${calcularMontoTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calcularMontoTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePedido}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido modificado */}
        {pedidoModificado && (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Resumen del pedido modificado
              </h3>
            </div>
            <div className="p-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Campo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cliente</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedidoModificado.cliente}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dirección</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedidoModificado.direccion}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tipo Local</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedidoModificado.tipoLocal}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fecha Pedido</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedidoModificado.fechaPedido.toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fecha Entrega</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedidoModificado.fechaEntrega.toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Comprobante</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedidoModificado.comprobante_p}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Productos
                      </td>
                    </tr>
                    {pedidoModificado.productos.map((p, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Producto {i + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="font-medium">{p.nombre}</div>
                          <div className="text-gray-400">
                            {p.cantidad} unidades x ${p.montoPorProducto.toFixed(2)} ({p.embalaje}) = $
                            {(p.cantidad * p.montoPorProducto).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        $
                        {pedidoModificado.productos
                          .reduce((total, p) => total + p.cantidad * p.montoPorProducto, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateOrderPage
