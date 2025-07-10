import React,{useState} from "react";
import { useOrderCompletedDay } from "../DepotHocks/useOrderCompletedDay";
import OrderCompletedDayTable from "../DepotComponents/OrderCompletedDayTable";
import GraphOrderCompletedDay from "../DepotGraph/GraphOrderCompletedDay";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const OrderCompletedDayPage : React.FC = () => {
    const [page,setPage] = useState(1);
    const pageSize = 10;
    const [idfilter,setidFilter] = useState("");

    const {data: orders,loading , error , totalpages} = useOrderCompletedDay(page,pageSize);

    const filterOrders = orders.filter((order) =>
        order.OrderId.toString().includes(idfilter) 
    );

    if(loading) return <LoadingSpinner message="Cargando datos , por favor espere.." height="h-screen" />

    return(
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="flex items-center justify-between mb-6">
                <Link to={"/depot/depotmanager/reports/orderCompletedDay"}className="text-red-600 hover:underline pl-10"> 
                ← Volver atrás
                </Link>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
                    Pedidos completados del dia:
                </h1>
                <p className="text-center text-lg text-gray-700 mb-12">
                    Aquí podrás ver el listado de pedidos completados en el día junto con su fecha correspondiente.
                </p>

                <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
                    <input 
                        type="text"
                        placeholder="Filtrar por ID de pedido"
                        className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
                        value={idfilter}
                        onChange={(e) => setidFilter(e.target.value)}
                    />

                </div>


                {error ? (
                    <p className="text-red-600 text-center">{error}</p>
                ): (
                    <>
                    <OrderCompletedDayTable 
                    data={filterOrders.map(order => ({
                        OrderID: order.OrderId,
                        finishdate: order.finishdate
                    }))}
                    />
                    <GraphOrderCompletedDay
                    data={filterOrders.map(order => ({
                        orderId: order.OrderId,
                        finishDate: order.finishdate
                    }) )} />
                    {filterOrders.length === 0 && (
                        <p className="">
                            No se encontraron pedidos 
                        </p>
                    )}
                    <Pagination currentPage={page} totalPages={totalpages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderCompletedDayPage;