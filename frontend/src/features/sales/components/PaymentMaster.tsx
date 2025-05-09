import React from "react";

//componente para subir el comprobante: 

export const PaymentMaster : React.FC = () => {
    return(
        <div className="bg-white shadow-md rounded-lg p-4 mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Comprobante de pagos</h3>
            <input
                type="file"
                accept=".pdf, .png, .jpeg"
                className="mb-4 w-full text-sm"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded cursor-pointer">
                Subir comprobante
            </button>
        </div>
    )
}