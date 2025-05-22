import { Link } from "react-router-dom";
import { OrderTableData } from "../../types/OrderTypes";

type Props = {
  order: OrderTableData | null;
};

export default function OrderDetails({ order }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-AR");

  if (!order) return null;

  return (
    <div>
        {order && (
          <div className="space-y-6 mt-10 w-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Cliente:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.customerFirstName} {order.customerLastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Fecha Pedido:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Fecha Entrega:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.deliveryDate ? formatDate(order.deliveryDate) : "No asignada"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Detalles de entrega:</label>
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.deliveryDetail || "No especificado"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Estado:</label> 
              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.status}</p>
            </div>
            <div className="space-y-4 pt-2">
                <table className="table-fixed w-full border-separate">
                  <thead>
                    <tr>
                      <th className="w-1/3 text-left px-4 py-2">Producto</th>
                      <th className="w-1/3 text-left px-4 py-2">Marca</th>
                      <th className="w-1/3 text-left px-4 py-2">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="align-top">
                        <td className="pr-2 px-4 py-2">{item.productName}</td>
                        <td className="pr-2 px-4 py-2">{item.productBrand}</td>
                        <td className="pr-2 px-4 py-2">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            <div className="mt-10">
              <Link 
                to={`/sales/orders/update/${order.id}`}
                className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
              >
                Editar órden
              </Link>
            </div>        
          </div>
        )}
      </div>
  );
}
