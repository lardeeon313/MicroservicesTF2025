import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  onClear,
  loading
}) => {
  return (
    <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-2 items-end w-full bg-white rounded-lg shadow p-4 border">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded pl-8 pr-2 py-1 w-48"
          placeholder="Nombre del cliente"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Desde</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hasta</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-gray-300 rounded"
        onClick={onClear}
      >
        Limpiar
      </button>
    </form>
  );
};

export default SearchBar; 