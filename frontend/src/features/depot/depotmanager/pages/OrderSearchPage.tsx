import { OrderSearch } from '../components/OrderSearch';
import BackButton from '../components/BackButton';

const OrderSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Búsqueda de Órdenes</h1>
              <p className="mt-2 text-gray-600">
                Busca órdenes específicas por su ID para ver detalles completos
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>

        <OrderSearch />
      </div>
    </div>
  );
};

export default OrderSearchPage; 