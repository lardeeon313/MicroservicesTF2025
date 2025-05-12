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

    //los datos del nuevo cliente: 
    
    return { valido: true }
  }

  const VerificarDatosClienteNuevo = () => {
    const nombre = (document.querySelector("#nombreCliente") as HTMLInputElement)?.value.trim();
    const telefono = (document.querySelector("#telefonoCliente") as HTMLInputElement)?.value.trim();
    const correo = (document.querySelector("#correoCliente") as HTMLInputElement)?.value.trim();
    const direccion = (document.querySelector("#direccionCliente") as HTMLInputElement)?.value.trim();

    if (!nombre || !telefono || !correo || !direccion) {
      return {
        valido: false,
        mensaje: "Por favor completá todos los campos del nuevo cliente antes de emitir el pedido."
      };
  }

  return { valido: true };
  }

  const handleSubmit = () => {
    const resultado = validarFormulario() 
    const resultadodos = VerificarDatosClienteNuevo();
    
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
    if(!resultadodos.valido){
      Swal.fire({
        title: 'Error',
        text: resultadodos.mensaje,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
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
    <div className="w-full space-y-4">
      <div className="bg-green-700 text-white text-lg font-semibold py-3 rounded shadow text-center">
        Crear Nota de Pedido
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Fecha de Pedido
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={fechaPedido}
            onChange={(e) => setFechaPedido(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Fecha de entrega
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              {["Producto", "Marca", "Unidad", "Embalaje", "Cantidad", "Acciones"].map((header, i) => (
                <th key={i} className="px-3 py-2 border text-sm font-medium" style={{ width: i === 5 ? '100px' : 'auto' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50 transition">
                {["producto", "marca", "unidad", "embalaje", "cantidad"].map((field, i) => (
                  <td key={i} className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:outline-none"
                      value={(row as any)[field]}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                      placeholder={
                        field === "producto"
                          ? "Nombre del producto"
                          : field === "marca"
                          ? "Nombre de la marca"
                          : field === "unidad"
                          ? "Unidad correspondiente"
                          : field === "embalaje"
                          ? "Embalaje correspondiente"
                          : "Cantidad de unidades"
                      }
                    />
                  </td>
                ))}
                <td className="border text-center px-2 py-1">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md text-sm shadow"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-start">
        <button
          onClick={handleAddRow}
          disabled={rows.length >= MAX_ROWS}
          className={`px-4 py-2 rounded-md text-white font-medium shadow ${
            rows.length >= MAX_ROWS
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Agregar fila
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Observaciones
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          rows={4}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          className="bg-black text-white font-semibold px-6 py-2 rounded-md w-full hover:bg-gray-900 transition shadow"
          onClick={handleSubmit}
        >
          Emitir Pedido
        </button>
      </div>
    </div>
  )
}

export default NewOrderForm