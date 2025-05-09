"use client"

import React, { useState } from "react"

interface Cliente {
  id: number
  nombre: string
  direccion: string
  icono?: string
}

interface CustomerFormProps {
  onSelectClient: (cliente: Cliente) => void
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Lista de clientes vacía inicialmente
  const [clientes, setClientes] = useState<Cliente[]>([])

  // Filtrar clientes según término de búsqueda
  const filteredClientes = searchTerm
    ? clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : clientes

  // Manejar cambio en la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar Cliente"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white px-2">
          🔍
        </button>
      </div>

      <div className="bg-gray-100 rounded-md border border-gray-300 min-h-[100px] mb-4">
        {/* Aquí se mostrarían los resultados de la búsqueda */}
        {filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className="flex items-start p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectClient(cliente)}
          >
            <div className="mr-2 mt-1">{cliente.icono}</div>
            <div>
              <div className="font-semibold">{cliente.nombre}</div>
              <div className="text-sm text-gray-600">{cliente.direccion}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="bg-black text-white px-4 py-1 rounded-md text-sm"
          onClick={() => filteredClientes.length > 0 && onSelectClient(filteredClientes[0])}
          disabled={filteredClientes.length === 0}
        >
          Seleccionar Cliente
        </button>
      </div>
    </div>
  )
}

export default CustomerForm