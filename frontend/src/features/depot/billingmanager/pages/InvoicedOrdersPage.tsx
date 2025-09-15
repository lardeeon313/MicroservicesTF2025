import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoicedOrders,
  getInvoicedOrdersByCustomer
} from '../services/OrderService';
import OrderTable from '../components/OrderTable';
import BackButton from '../../../../components/BackButton';

const PAGE_SIZE = 5;

const InvoicedOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getAllInvoicedOrders()
      .then(res => {
      console.log("Órdenes devueltas:", res[0]); // 👀 mirar la primera orden
      setOrders(res);
    })
      .catch(() => setError('Error al cargar las órdenes facturadas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Buscador por cliente (visual igual a Pending: input simple; ejecutar con Enter)
  const handleSearch = async () => {
    setSearching(true);
    setError(null);
    try {
      if (search) {
        const data = await getInvoicedOrdersByCustomer(search);
        console.log("Resultado búsqueda:", data[0]); 
        setOrders(data);
      } else {
        fetchOrders();
      }
      setPage(1);
    } catch {
      setError('Error en la búsqueda.');
    } finally {
      setSearching(false);
    }
  };

  // Paginación
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetail = (id: number) => {
    navigate(`/depot/billingmanager/invoiced-orders/${id}`);
  };

  return (
    <div className="container m-0 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Órdenes Facturadas</h1>
              <p className="mt-2 text-gray-600">
                Visualiza y gestioná todas las órdenes que ya han sido facturadas.
              </p>
            </div>
            <BackButton to="/depot/billingmanager" />
          </div>
        </div>
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={e => { setSearch(e.target.value); }}
          onKeyDown={e => { if (e.key === 'Enter' && !searching) { handleSearch(); } }}
          className="border px-3 py-1 rounded w-64"
        />
      </div>
      <OrderTable
        orders={paginatedOrders
          //FILTRA UNICAMENTE LOS PEDIDOS CON ESTADO DE FACTURADA O CON EL STATUS 8
          .filter(order => order.status === 8 || order.status === '8' || order.status === 'Facturada')
          .map(order => ({
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
        activeTab={'invoiced'}
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

export default InvoicedOrdersPage; 