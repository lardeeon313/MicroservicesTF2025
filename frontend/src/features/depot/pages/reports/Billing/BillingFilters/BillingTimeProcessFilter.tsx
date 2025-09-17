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
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 w-full">
      <form
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Desde:</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Hasta:</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessingTimeOrderFilter;

