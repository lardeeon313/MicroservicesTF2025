import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoicedOrders,
  getInvoicedOrdersByCustomer,
  getInvoicedOrdersByDateRange
} from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../components/OrderTable';
import { OrderStatus } from '../../depotmanager/types/OrderTypes';
import { getInvoicedOrdersByCustomerSchema, getInvoicedOrdersByDateRangeSchema } from '../validations/orderSchemas';

const InvoicedOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);
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

  // Adaptar DepotOrderDto a OrderTableData
  const mapToOrderTableData = (order: DepotOrderDto) => ({
    id: order.DepotOrderId,
    customerFirstName: order.CustomerName,
    customerLastName: '',
    orderDate: order.OrderDate,
    deliveryDate: '',
    deliveryDetail: order.DeliveryDetail,
    status: order.Status as OrderStatus,
    items: order.Items.map(item => ({
      id: item.Id,
      productName: item.ProductName,
      productBrand: item.ProductBrand,
      quantity: item.Quantity,
    })),
    total: order.TotalAmount,
  });

  const orderTableData = orders.map(mapToOrderTableData);

  const handleFilterByCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFilterError(null);
    try {
      await getInvoicedOrdersByCustomerSchema.validate({ CustomerId: customerId });
      setLoading(true);
      const data = await getInvoicedOrdersByCustomer(customerId);
      setOrders(data);
    } catch (err: any) {
      setFilterError(err.errors ? err.errors[0] : 'Error en el filtro.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFilterError(null);
    try {
      await getInvoicedOrdersByDateRangeSchema.validate({ StartDate: startDate, EndDate: endDate });
      setLoading(true);
      const data = await getInvoicedOrdersByDateRange(startDate, endDate);
      setOrders(data);
    } catch (err: any) {
      setFilterError(err.errors ? err.errors[0] : 'Error en el filtro.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setCustomerId('');
    setStartDate('');
    setEndDate('');
    setFilterError(null);
    fetchOrders();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Órdenes Facturadas</h2>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <form onSubmit={handleFilterByCustomer} className="flex gap-2 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Cliente</label>
            <input
              type="text"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="GUID del cliente"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Filtrar por cliente</button>
        </form>
        <form onSubmit={handleFilterByDate} className="flex gap-2 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Desde</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasta</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Filtrar por fechas</button>
        </form>
        <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-300 rounded">Limpiar filtros</button>
      </div>
      {filterError && <div className="text-red-500 mb-2">{filterError}</div>}
      <OrderTable
        orders={orderTableData}
        loading={loading}
        error={error}
        onRefetch={fetchOrders}
        onView={(id) => navigate(`/depot/billingmanager/invoiced-orders/${id}`)}
        onActionChange={() => {}}
        showEditButton={false}
        showDeleteButton={false}
        showStatusChange={false}
        customActions={[]}
      />
    </div>
  );
};

export default InvoicedOrdersPage; 