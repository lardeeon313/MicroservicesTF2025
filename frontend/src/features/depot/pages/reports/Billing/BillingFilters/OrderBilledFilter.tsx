import React, { useState } from "react";

type Props = {
  onSearch: (customerId: string) => void;
  onClear: () => void;
};

const OrderBilledFilter: React.FC<Props> = ({ onSearch, onClear }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/2 mx-auto mb-8 flex flex-col gap-4 items-center">
      <label className="text-sm font-semibold text-gray-700 text-center">
        Buscar por Customer ID
      </label>
      <input
        type="text"
        placeholder="🆔 Ingresar Customer ID"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 text-center"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          onClick={handleSearch}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Buscar
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default OrderBilledFilter;

