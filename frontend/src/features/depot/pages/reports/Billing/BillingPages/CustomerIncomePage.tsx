import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useCustomerIncome } from "../BillingHocks/useCustomerIncome";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeTable from "../BillingComponents/CustomerIncomeTable";
import GraphCustomerIncome from "../BillingGraphs/GraphCustomerIncome";

const CustomerIncomePage: React.FC = () => {
    const [page,setPage] = useState(1);
    const pageSize = 10; 

    const {data,loading,error,totalPages} = useCustomerIncome(page,pageSize);

    const [idfilter,setIdfilter] = useState("");

    if(loading){
        return <LoadingSpinner message="cargando los datos..." height="h-screen"/>
    }

    return(
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="flex items-center justify-between mb-6">
                <Link to={"/depot/depotmanager/reports/Dashboard"} className="text-red-600 hover:underline pl-10">
                ← Volver atrás
                </Link>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
                    Ingresos generados por los clientes:
                </h1>
                <p className="text-center text-lg text-gray-700 mb-12">
                    Aqui podras ver todos los ingresos que fueron generados por los distintos clientes
                    luego de hacer la facturacion.
                </p>

                <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
                    <input 
                        type="text"
                        placeholder="Filtrar por ID de pedido"
                        className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
                        value={idfilter}
                        onChange={(e) => setIdfilter(e.target.value)}
                    />
                </div>

                {error ? (
                <p className="text-red-600 text-center">{error}</p>
                ): (
                <>
                    <CustomerIncomeTable data=
                    {
                        data.map(item => ({
                            orderid: item.orderID,
                            billingDate: item.billingDate,
                            totalAmount: item.totalAmount
                        }))
                    }/>
                    <GraphCustomerIncome data=
                    {
                        data.map(item => ({
                            BillingDate: item.billingDate,
                            TotalAmount: item.totalAmount
                        }))
                    }/>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
                </>
                    )
                }

            </div>
        </div>
    )
}

export default CustomerIncomePage;