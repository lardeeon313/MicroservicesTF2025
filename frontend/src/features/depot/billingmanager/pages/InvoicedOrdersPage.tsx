import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoicedOrders,
} from '../services/OrderService';
import OrderTable from '../components/OrderTable';
import BackButton from '../../../../components/BackButton';
import Pagination from '../../depotmanager/components/Pagination';

const PAGE_SIZE = 5;

const InvoicedOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [page, setPage] = useState(1);
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

  // Filtrado por nombre o email en frontend
  const filteredOrders = orders.filter(order => {
    const nameMatch = order.customerName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const emailMatch = order.customerEmail
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    return (
      (searchName === '' || nameMatch) &&
      (searchEmail === '' || emailMatch)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewDetail = (id: number) => {
    const selected = orders.find(o => o.depotOrderId === id);
    navigate(`/depot/billingmanager/invoiced-orders/${id}`, { state: { order: selected || null } });
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Órdenes Facturadas</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Visualiza y gestioná todas las órdenes que ya han sido facturadas.
          </p>
          {/* Buscador */}
          <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-2 w-auto mb-8">
            <div className="flex justify-center mb-6 mt-6">
              <div className="flex flex-col md:flex-row gap-24 w-full max-w-3xl">
                {/* Cliente */}
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                  <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    value={searchName}
                    onChange={e => { setSearchName(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 w-full focus:ring-red-400 focus:outline-none transition"
                  />
                </div>
                {/* Correo Electrónico */}
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium text-gray-600 mb-1">Correo Electrónico:</label>
                  <input
                    type="text"
                    placeholder="Buscar por correo electrónico..."
                    value={searchEmail}
                    onChange={e => { setSearchEmail(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 w-full focus:ring-red-400 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
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
                address: order.address,
              }))}
              loading={loading}
              error={error}
              onRefetch={fetchOrders}
              onView={handleViewDetail}
              activeTab={'invoiced'}
          />
          {/* Paginación */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicedOrdersPage; 