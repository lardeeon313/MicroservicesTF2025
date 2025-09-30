
const PendingOrdersVerificationPage = () => {
  return (
    <div className="container m-0 pt-36 min-w-full min-h-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Pedidos Pendientes de Verificación
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Revisá todos los pedidos que esperan ser verificados
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Esta página mostrará la lista de pedidos pendientes de verificación.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersVerificationPage;
