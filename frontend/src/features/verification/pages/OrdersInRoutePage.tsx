
const OrdersInRoutePage = () => {
  return (
    <div className="container m-0 pt-36 min-w-full min-h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Pedidos en Camino
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualizá los pedidos que están siendo entregados por repartidores
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Esta página mostrará la lista de pedidos que están en camino siendo entregados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersInRoutePage;
