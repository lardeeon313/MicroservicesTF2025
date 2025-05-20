import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  height?: string; // ej: "min-h-[200px]", "h-screen"
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Cargando...",
  height = "min-h-[200px]",
}) => {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="bg-white rounded-2xl border-gray-200 p-6 flex flex-col items-center gap-4 animate-fade-in">
        <svg
          className="animate-spin h-8 w-8 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
