import React, { useState } from "react";

type Props = {
  onFilter: (from: string, to: string) => void;
  onClear: () => void;
};

const ProcessingTimeOrderFilter: React.FC<Props> = ({ onFilter, onClear }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(from, to);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end mb-4 bg-white p-4 rounded-lg shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Desde:</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hasta:</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default ProcessingTimeOrderFilter;

