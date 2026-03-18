import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { DepotOrderMissingDto, OrderStatus } from "../types/OrderTypes";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { /*getMissingOrderById */ reportMissingOrder } from "../services/orderService";
import SearchBar from "../components/MissingPage/SearchBar";
import MissingOrdersGrid from "../components/MissingPage/MissingOrderGrid";
import MissingOrderDetailModal from "../components/MissingPage/MissingOrderDetailModal";
import ReportConfirmModal from "../components/MissingPage/ReportConfirmModal";
import BackButton from "../../../../components/BackButton";
import OrderTabs from "../../../../components/OrderTabs";

function MissingOrdersPage() {
  const { missingOrders, loading, error, fetchMissingOrders } = useOrders();

  const [selectedMissingOrder, setSelectedMissingOrder] =
    useState<DepotOrderMissingDto | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(OrderStatus.MissingProduct);
  const [showReportModal, setShowReportModal] = useState(false);
  const [orderToReport, setOrderToReport] =
    useState<DepotOrderMissingDto | null>(null);
  const [searchLoading] = useState(false);

  //
  const [filteredOrders, setFilteredOrders] = useState<DepotOrderMissingDto[] | null>(null);

  const pendingMissingOrders = missingOrders.filter(
    (m) => m.depotOrder.status === OrderStatus.MissingProduct
  );
  const reportedMissingOrders = missingOrders.filter(
    (m) => m.depotOrder.status === OrderStatus.PendingResolution
  );

  const baseOrders =
  activeStatus === OrderStatus.MissingProduct
    ? pendingMissingOrders
    : reportedMissingOrders;

  const orderToShow = filteredOrders ?? baseOrders;

  const handleReportToSales = (missingOrder: DepotOrderMissingDto) => {
    setOrderToReport(missingOrder);
    setShowReportModal(true);
  };

  const confirmReportToSales = async () => {
    if (!orderToReport) return;
    try {
      await reportMissingOrder({
        depotOrderId: orderToReport.depotOrderId,
        missingItems: orderToReport.missingItems.map((item) => ({
          orderItemId: item.salesOrderItemId,
          productName: item.productName,
          productBrand: item.productBrand,
          packaging: item.packaging,
          quantity: item.missingQuantity,
        })),
        missingReason: orderToReport.missingReason,
        missingDescription: orderToReport.missingDescription,
      });
      toast.success("Faltante reportado a ventas exitosamente");
      setShowReportModal(false);
      setOrderToReport(null);
      await fetchMissingOrders();
    } catch (error) {
      toast.error("Error al reportar faltante a ventas");
    }
  };

  const handleSearch = (id: number) => {
    const found = baseOrders.filter(
      (m) => m.depotOrderId === id
    );

    if (found.length === 0) {
      toast.error("No se encontró el pedido con ese ID en este estado");
      setFilteredOrders([]);
      return;
    }

    setFilteredOrders(found);
    setSelectedMissingOrder(found[0]);
    toast.success("Pedido encontrado");
  }

  const handleTabChange = (status: OrderStatus) => {
    setActiveStatus(status);
    setFilteredOrders(null);
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando órdenes con faltantes..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Órdenes con Faltantes</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás gestionar las órdenes que tienen productos faltantes y reportarlos a ventas.
          </p>        

          <SearchBar onSearch={handleSearch} loading={searchLoading} />
          <OrderTabs
            activeStatus={activeStatus}
            onChange={handleTabChange}
            tabs={[
              {
                status: OrderStatus.MissingProduct,
                label: "Pendientes",
                count: pendingMissingOrders.length,
              },
              {
                status: OrderStatus.PendingResolution,
                label: "Reportadas",
                count: reportedMissingOrders.length,
              },
            ]}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <MissingOrdersGrid
            key={activeStatus}
            orders={orderToShow}
            onView={setSelectedMissingOrder}
            onReport={handleReportToSales}
          />

          {/* Modales */}
          <MissingOrderDetailModal
            order={selectedMissingOrder}
            onClose={() => setSelectedMissingOrder(null)}
            onReport={handleReportToSales}
          />

          <ReportConfirmModal
            open={showReportModal}
            order={orderToReport}
            onCancel={() => setShowReportModal(false)}
            onConfirm={confirmReportToSales}
          />
        </div>
      </div>
    </div>
  );
}

export default MissingOrdersPage;
