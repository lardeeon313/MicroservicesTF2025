"use client"

import React, { useState } from "react"
import Swal from 'sweetalert2'

interface Cliente {
  id: number
  nombre: string
  direccion: string
  icono?: string
}

interface NewOrderFormProps {
  cliente?: Cliente
  datosNuevoCliente?: {
    nombre: string
    telefono: string
    correo: string
    direccion: string
  }
}

const MAX_ROWS = 20

const NewOrderForm: React.FC<NewOrderFormProps> = ({ cliente, datosNuevoCliente }) => {
  const [fechaPedido, setFechaPedido] = useState("")
  const [fechaEntrega, setFechaEntrega] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [rows, setRows] = useState(
    Array.from({ length: 3 }, () => ({ producto: "", marca: "", unidad: "", embalaje: "", cantidad: "" }))
  )

  const handleAddRow = () => {
    if (rows.length < MAX_ROWS) {
      setRows([...rows, { producto: "", marca: "", unidad: "", embalaje: "", cantidad: "" }])
    }
  }

  const handleRemoveRow = (index: number) => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows]
    updatedRows[index] = { ...updatedRows[index], [field]: value }
    setRows(updatedRows)
  }

  const validarFormulario = () => {
    // Validar fechas
    if (!fechaPedido) {
      return { valido: false, mensaje: "La fecha de pedido es obligatoria" }
    }
    
    if (!fechaEntrega) {
      return { valido: false, mensaje: "La fecha de entrega es obligatoria" }
    }

    //Verifica que la fecha de entrega sea mayor a la de pedido y que ademas 
    //aplicando las reglas de negocio que sea mayor dentro de un plazo aceptable 
    const fechaPedidoDate = new Date(fechaPedido);
    const fechaEntregaDate = new Date(fechaEntrega);
    const diferenciaDias = (fechaEntregaDate.getTime() - fechaPedidoDate.getTime()) / (1000 * 60 * 60 * 24)
    
    // Validar que al menos una fila tenga datos
    const filasValidas = rows.filter(row => 
      row.producto && row.marca && row.unidad && row.embalaje && row.cantidad
    )
    
    if (filasValidas.length === 0) {
      return { valido: false, mensaje: "Debe agregar al menos un producto con todos sus datos" }
    }
    
    // Validar que todas las filas con algún dato tengan todos los campos completos
    const filasIncompletas = rows.filter(row => 
      (row.producto || row.marca || row.unidad || row.embalaje || row.cantidad) && 
      (!row.producto || !row.marca || !row.unidad || !row.embalaje || !row.cantidad)
    )
    
    if (filasIncompletas.length > 0) {
      return { valido: false, mensaje: "Hay productos con información incompleta" }
    }
    
    // Si es un nuevo cliente, validar que tenga todos los datos
    if (datosNuevoCliente && (!datosNuevoCliente.nombre || !datosNuevoCliente.telefono || 
        !datosNuevoCliente.correo || !datosNuevoCliente.direccion)) {
      return { valido: false, mensaje: "Debe completar todos los datos del cliente" }
    }

    if(fechaEntregaDate <= fechaPedidoDate){
      return { valido: false, mensaje: "La fecha de entrega debe ser posterior a la fecha de pedido" }
    }

    if (diferenciaDias < 5) {
      return { valido: false, mensaje: "La fecha de entrega debe ser al menos 5 días posterior a la fecha de pedido" }
    }
    
    // Si es un cliente existente, validar que se haya seleccionado uno
    /*if (!datosNuevoCliente && !cliente) {
      return { valido: false, mensaje: "Debe seleccionar un cliente" }
    }*/
    
    return { valido: true }
  }

  const handleSubmit = () => {
    const resultado = validarFormulario()
    
    if (!resultado.valido) {
      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: resultado.mensaje,
        icon: 'error',
        confirmButtonText: 'Entendido'
      })
      return
    }
    
    // Si todo está correcto, mostrar alerta de éxito
    Swal.fire({
      title: '¡Éxito!',
      text: 'El pedido se ha emitido correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para enviar el pedido a tu backend
        console.log('Pedido enviado:', {
          cliente: cliente || datosNuevoCliente,
          fechaPedido,
          fechaEntrega,
          productos: rows.filter(row => row.producto), // Solo enviar filas con productos
          observaciones
        })
        
        // Opcional: resetear el formulario
        setFechaPedido("")
        setFechaEntrega("")
        setObservaciones("")
        setRows(Array.from({ length: 3 }, () => ({ producto: "", marca: "", unidad: "", embalaje: "", cantidad: "" })))
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-800 text-white p-2 mb-4 text-center">Crear Nota de Pedido</div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Pedido
        </label>
        <input
          type="date"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={fechaPedido}
          onChange={(e) => setFechaPedido(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
          Fecha de entrega
        </label>
        <input
          type="date"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border border-black text-sm">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="border border-black px-2 py-1">Producto</th>
              <th className="border border-black px-2 py-1">Marca</th>
              <th className="border border-black px-2 py-1">Unidad</th>
              <th className="border border-black px-2 py-1">Embalaje</th>
              <th className="border border-black px-2 py-1">Cantidad</th>
              <th className="border border-black px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {["producto", "marca", "unidad", "embalaje", "cantidad"].map((field, i) => (
                  <td key={i} className="border border-black px-2 py-1">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border-gray-300 rounded"
                      value={(row as any)[field]}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                      placeholder={field === "producto" ? "Nombre del producto" : 
                                  field === "marca" ? "Nombre de la marca" :
                                  field === "unidad" ? "Unidad correspondiente" :
                                  field === "embalaje" ? "Embalaje correspondiente" :
                                  "Cantidad de 5 unidades"}
                    />
                  </td>
                ))}
                <td className="border border-black text-center">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 flex justify-between">
          <button
            onClick={handleAddRow}
            disabled={rows.length >= MAX_ROWS}
            className={`px-4 py-2 rounded text-white ${
              rows.length >= MAX_ROWS
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Agregar fila
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          className="w-full border border-gray-300 rounded px-4 py-2"
          rows={4}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button 
          className="bg-black text-white font-semibold px-6 py-2 rounded w-full"
          onClick={handleSubmit}
        >
          Emitir Pedido
        </button>
      </div>
    </div>
  )
}

export default NewOrderForm