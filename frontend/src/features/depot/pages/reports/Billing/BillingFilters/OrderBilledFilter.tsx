import React from "react";
import { FiCalendar } from "react-icons/fi";

type Props = {
    orderDate: string;
    billingDate: string;
    onOrderDateChange: (value: string) => void;
    onBillingDateChange: (value: string) => void;
};

const OrderBilledFilter: React.FC<Props> = ({
    orderDate,
    billingDate,
    onOrderDateChange,
    onBillingDateChange,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-xl">
            {/* Fecha de pedido */}
            <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                    Filtrar por fecha de pedido
                </label>
                <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
                        value={orderDate}
                        onChange={(e) => onOrderDateChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Fecha de factura */}
            <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                    Filtrar por fecha de factura
                </label>
                <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
                        value={billingDate}
                        onChange={(e) => onBillingDateChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderBilledFilter;

