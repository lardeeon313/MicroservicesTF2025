import { useParams } from 'react-router-dom';

const OrdersInRouteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container m-0 pt-36 min-w-full min-h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Detalles del Pedido en Camino #{id}
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Información detallada del pedido que está siendo entregado
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Esta página mostrará los detalles del pedido {id} que está en camino siendo entregado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersInRouteDetailsPage;
