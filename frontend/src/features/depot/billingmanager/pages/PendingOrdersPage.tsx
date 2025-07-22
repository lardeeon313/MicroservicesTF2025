import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingBillingOrders } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../components/OrderTable';
import BackButton from '../components/BackButton';

const PAGE_SIZE = 5;

const PendingOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getPendingBillingOrders()
      .then(setOrders)
      .catch(() => setError('Error al cargar las órdenes pendientes de facturación.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Buscador por nombre de cliente
  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetail = (id: number) => {
    navigate(`/depot/billingmanager/pending-orders/${id}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <BackButton to="/depot/billingmanager" />
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-3 py-1 rounded w-64"
        />
      </div>
      <OrderTable
        orders={paginatedOrders.map(order => ({
          id: order.depotOrderId,
          customerFirstName: order.customerName,
          orderDate: order.orderDate,
          deliveryDetail: order.deliveryDetail,
          status: order.status,
          items: order.items,
          total: order.totalAmount,
        }))}
        loading={loading}
        error={error}
        onRefetch={fetchOrders}
        onView={handleViewDetail}
      />
      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PendingOrdersPage; 