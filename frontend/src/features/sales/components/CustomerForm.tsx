"use client"

import React, { useState } from "react";
import { FiSearch,FiCheckCircle  } from 'react-icons/fi';
import styles from '../styles/CustomerForm.module.css';

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
    <div className="w-full space-y-4">
    {/* Input de búsqueda */}
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar Cliente"
        className="w-full p-3 pr-10 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
        id="SearchBuscador"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800">
        <FiSearch size={18} />
      </button>
    </div>

    {/* Resultados */}
    <div className="w-full bg-gray-50 rounded-md border border-gray-300 min-h-[100px] shadow-sm">
      {filteredClientes.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No se encontraron clientes.</div>
      ) : (
        filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className={styles.clienteItem}
            onClick={() => onSelectClient(cliente)}
          >
            <div className={styles.clienteIcon}>{cliente.icono}</div>
            <div>
              <div className={styles.clienteNombre}>{cliente.nombre}</div>
              <div className={styles.clienteDireccion}>{cliente.direccion}</div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Botón */}
    <div className="flex justify-end">
      <button
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-blue-700 disabled:opacity-50 transition"
        onClick={() => filteredClientes.length > 0 && onSelectClient(filteredClientes[0])}
        disabled={filteredClientes.length === 0}
      >
        <FiCheckCircle size={16} />
        Seleccionar Cliente
      </button>
    </div>
  </div>
  )
}

export default CustomerForm