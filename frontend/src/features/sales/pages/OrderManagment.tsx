import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";
import { MockOrders } from "../data/MockOrders";
import { OrderProps } from "../components/Order";

export const OrderManagment = () => {
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate();
    const [orders,setOrders] = useState<OrderProps[]>(MockOrders);
    // Cierra el menú si se hace clic fuera (opcional más adelante)
    
    //codigo actualizado para eliminar pedido dentro de la lista: 
    const DeleteOrder = (id:string) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !==id))
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <section className="px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Gestión de pedidos</h1>
                    
                    <div className="relative inline-block text-left">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            + Agregar nuevo pedido
                        </button>
                        {showOptions && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            navigate("/nuevo-cliente");
                                            setShowOptions(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Para un nuevo cliente
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/cliente-existente");
                                            setShowOptions(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Para un cliente existente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/**listado con todos los pedidos */}
                <div>
                {orders.map((order) =>(
                    <OrderCard key={order.id} order={order} onDelete={DeleteOrder} />
                ))}
                </div>
            </section>
        </div>
    );
};

export default OrderManagment;
