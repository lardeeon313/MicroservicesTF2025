import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
  onSearch: (id: number) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [searchId, setSearchId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearch(Number(searchId));
      setSearchId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Buscar por ID de orden"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </form>
  );
}
