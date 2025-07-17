import React from "react";
import type { Customer } from "../../../../types/CustomerTypes";
import { CustomerStatus } from "../../../../types/CustomerTypes";

interface Props{
    customers: Customer[];
}

const InactiveCustomerTable : React.FC<Props> = ({customers}) => {
    //en cada caso de estado , actua o hace algo
    const statusToString = (status : CustomerStatus): string => {
        switch(status){
            case CustomerStatus.Active:
                return "Activo";
            case CustomerStatus.Inactive:
                return "Inactivo";
            case CustomerStatus.Lost:
                return "Perdido";
            default:
                return "Desconocido";
        };
    };

    return(
        <div className="p-6">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 border-b">ID</th>
                            <th className="py-3 px-6 border-b">Nombre</th>
                            <th className="py-3 px-6 border-b">Email</th>
                            <th className="py-3 px-6 border-b">Fecha del pedido</th>
                            <th className="py-3 px-6 border-b">Estado</th>
                        </tr>
                    </thead>
                <tbody>
                {customers.map((c,index) => (
                    <tr key={c.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="py-2 px-4 text-center">{c.id}</td>
                        <td className="py-2 px-4 text-center">{c.firstName} {c.lastName}</td>
                        <td className="py-2 px-4 text-center">{c.email}</td>
                        <td className="py-2 px-4 text-center">{new Date(c.registrationDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4 text-center">{statusToString(c.status)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}

export default InactiveCustomerTable;