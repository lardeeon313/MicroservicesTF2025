import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoicedOrders,
  getInvoicedOrdersByCustomer,
  getInvoicedOrdersByDateRange
} from '../services/OrderService';
import OrderTable from '../components/OrderTable';
import BackButton from '../components/BackButton';
import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 5;

const InvoicedOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'all' | 'modified'>('all');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getAllInvoicedOrders()
      .then(setOrders)
      .catch(() => setError('Error al cargar las órdenes facturadas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tabs
  const allOrders = orders.filter(o => !o.wasModified);
  const modifiedOrders = orders.filter(o => o.wasModified);

  // Buscador avanzado
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    try {
      if (search) {
        const data = await getInvoicedOrdersByCustomer(search);
        setOrders(data);
      } else if (startDate && endDate) {
        const data = await getInvoicedOrdersByDateRange(startDate, endDate);
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
  const filtered = tab === 'all' ? allOrders : modifiedOrders;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedOrders = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetail = (id: number) => {
    navigate(`/depot/billingmanager/invoiced-orders/${id}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <BackButton to="/depot/billingmanager" />
        <h2 className="text-2xl font-bold text-blue-700">Órdenes Facturadas</h2>
      </div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:gap-6 gap-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onSearch={handleSearch}
          onClear={() => { setSearch(''); setStartDate(''); setEndDate(''); fetchOrders(); }}
          loading={searching}
        />
      </div>
      {/* Tabs */}
      <Tabs
        tabs={[
          { key: 'all', label: 'Órdenes Facturadas', count: allOrders.length },
          { key: 'modified', label: 'Órdenes Modificadas', count: modifiedOrders.length },
        ]}
        activeTab={tab}
        onChange={key => { setTab(key as 'all' | 'modified'); setPage(1); }}
      />
      <div className="bg-white rounded-lg shadow p-4 border">
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
      </div>
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