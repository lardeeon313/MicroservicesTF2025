import {  Routes, Route, Outlet } from "react-router-dom";

// Páginas comunes / públicas
import HomePage from "../features/common/pages/HomePage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Unauthorized from "../features/auth/components/Unauthorized";

// Auth
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

// Ventas
import OrdersPage from "../features/sales/pages/orders/OrdersPage";
import ViewOrderPage from "../features/sales/pages/orders/ViewOrderPage";
import RegisterOrderPage from "../features/sales/pages/orders/RegisterOrderPage";
import EditOrderPage from "../features/sales/pages/orders/EditOrderPage";
import RegisterCustomerPage from "../features/sales/pages/customers/RegisterCustomerPage";
import ViewCustomerPage from "../features/sales/pages/customers/ViewCustomerPage";
import EditCustomerPage from "../features/sales/pages/customers/EditCustomerPage";
import CustomersPage from "../features/sales/pages/customers/CustomersPage";
import { DashboardPage } from "../features/sales/pages/DashboardPage";
import { DashboardReportsPage } from "../features/sales/pages/DashboardReportsPage";
import CustomerReportPage from "../features/sales/pages/reports/CustomerReportPage";
import CustomerSatisfactionPage from "../features/sales/pages/reports/CustomerSatisfactionReportPage";
import CustomerInactiveReportPage from "../features/sales/pages/reports/CustomerInactiveReportPage";
import ModifiedCanceledOrdersPage from "../features/sales/pages/reports/ModifiedCanceledOrdersPage";
import { SalesPerfomanceReportPage } from "../features/sales/pages/reports/SalesPerfomanceReportPage";
import MissingOrdersSalesPage from "../features/sales/pages/orders/MissingOrderSalesPage";
import CustomerReportPaymentTypePage from "../features/sales/pages/reports/CustomerPaymenTypeReportPage";

// Depósito - Manager
import DepotManagerDashboard from "../features/depot/depotmanager/pages/DepotManagerDashboard";
import TeamsPage from "../features/depot/depotmanager/pages/TeamsPage";
import PendingOrdersPageDepot from "../features/depot/depotmanager/pages/PendingOrdersPage";
import InPreparationOrdersPage from "../features/depot/depotmanager/pages/InPreparationOrdersPage";
import PreparedOrdersPage from "../features/depot/depotmanager/pages/PreparedOrdersPage";
import MissingOrdersPage from "../features/depot/depotmanager/pages/MissingOrdersPage";
import { DashboardDepotReportsPage } from "../features/depot/pages/DashboardDepotReportsPage";
import DailyMissingPage from "../features/depot/pages/reports/Depot/DepotPages/DailyMissingPage";
import OrderCompletedDayPage from "../features/depot/pages/reports/Depot/DepotPages/OrderCompletedDayPage";
import TeamProdictivityPage from "../features/depot/pages/reports/Depot/DepotPages/TeamProdictiviyPage";
//import AverageTimeOrderPage from "../features/depot/pages/reports/Depot/DepotPages/AverageTimeOrderPage";

// Depósito - Facturación
import BillingManagerDashboard from "../features/depot/billingmanager/pages/BillingManagerDashboard";
import PendingOrdersPageBilling from "../features/depot/billingmanager/pages/PendingOrdersPage";
import PendingOrderDetailsPage from "../features/depot/billingmanager/pages/PendingOrderDetailsPage";
import InvoicedOrdersPage from "../features/depot/billingmanager/pages/InvoicedOrdersPage";
import InvoicedOrderDetailsPage from "../features/depot/billingmanager/pages/InvoicedOrderDetailsPage";
import BillingTimeProcessPage from "../features/depot/pages/reports/Billing/BillingPages/BillingTimeProcessPage";
import CustomerIncomePage from "../features/depot/pages/reports/Billing/BillingPages/CustomerIncomePage";
import OrderBilledPage from "../features/depot/pages/reports/Billing/BillingPages/OrderBilledPage";
import {DashboardBillingReportsPage} from "../features/depot/pages/DashboardBillingDepotPage";
import InvoicePage from "../features/depot/billingmanager/pages/InvoiceExportPage";
import InvoiceOneDetailPage from "../features/depot/billingmanager/pages/InvoiceDetailPage";

// Verification
import TeamsPageVerification from "../features/verification/pages/TeamsPage";
import VerificationManagerDashboardPage from "../features/verification/pages/VerificationManagerDashboard";
import PendingOrdersVerificationPage from "../features/verification/pages/PendingOrdersVerficationPage";
import PendingOrdersVerificationDetailsPage from "../features/verification/pages/PendingOrderVerificationDetailsPage";
import OrdersInRoutePage from "../features/verification/pages/OrdersInRoutePage";
import OrdersInRouteDetailsPage from "../features/verification/pages/OrdersInRouteDetailsPage";
import { DashboardLogisticReportsPage } from "../features/verification/pages/reports/DashboardLogisticReportsPage";

import { DeliveryIncidentsPage } from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryIncidentsPage";
import DeliveryRejectionsPage from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryRejectionsPage";
import { OrdersByStatusReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/OrderByStatusPage";
import { OrderStatusHistoryReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/OrderByStatusHistoryPage";
import DeliveryTeamActivityPage from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryTeamActivityPage";
import { PendingCashVerificationPage } from "../features/verification/pages/reports/Verification/VerificationPages/PendingCashVerificationPage";
import { OperatorProductivityPage } from "../features/verification/pages/reports/Verification/VerificationPages/OperatorProdictivityReportPage";
import DeliveryTimesReportPage from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryTimesPage";
import { ZonePerformanceReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/ZonePerfomancePage";

import ProcessingTimePage from "../features/depot/pages/reports/Depot/DepotPages/AverageTimeOrderPage";

const AppRouter = () => {
  return (
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404notfound" element={<NotFoundPage />} />

        {/* Ventas */}
        <Route
            path="/sales"
            element={
            <ProtectedRoute requiredRole="SalesStaff">
                <Outlet />
            </ProtectedRoute>
            }
        >
            <Route path="home" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/view/:id" element={<ViewOrderPage />} />
            <Route path="orders/registerOrder" element={<RegisterOrderPage />} />
            <Route path="orders/update/:id" element={<EditOrderPage />} />
            <Route path="missing-orders" element={<MissingOrdersSalesPage/>} />
            <Route path="customer/registerCustomer" element={<RegisterCustomerPage />} />
            <Route path="customer/viewCustomer/:id" element={<ViewCustomerPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customer/update/:id" element={<EditCustomerPage />} />
            <Route path="reports/dashboard" element={<DashboardReportsPage />} />
            <Route path="reports/customersReport" element={<CustomerReportPage />} />
            <Route path="reports/customerSatisfactionReport" element={<CustomerSatisfactionPage />} />
            <Route path="reports/customerStatusReport" element={<CustomerInactiveReportPage />} />
            <Route path="reports/modifiedCanceledReport" element={<ModifiedCanceledOrdersPage />} />
            <Route path="reports/salesPerfomance" element={<SalesPerfomanceReportPage />} />
            <Route path="reports/customerpaymentypereport" element={<CustomerReportPaymentTypePage/>} />
        </Route>

        {/* Depósito Manager */}
        <Route
            path="/depot"
            element={
            <ProtectedRoute requiredRole="DepotManager">
                <Outlet />
            </ProtectedRoute>
            }
        >
            <Route index element={<DepotManagerDashboard />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="pending-orders" element={<PendingOrdersPageDepot />} />
            <Route path="in-preparation-orders" element={<InPreparationOrdersPage />} />
            <Route path="prepared-orders" element={<PreparedOrdersPage />} />
            <Route path="missing-orders" element={<MissingOrdersPage />} />
            <Route path="reports" element={<DashboardDepotReportsPage />} />
            <Route path="reports/averageTimeOrder" element={<ProcessingTimePage />} />
            <Route path="reports/dailyMissing" element={<DailyMissingPage />} />
            <Route path="reports/orderCompletedDay" element={<OrderCompletedDayPage />} />
            <Route path="reports/teamProdictivity" element={<TeamProdictivityPage />} />
        </Route>

        {/* Depósito Facturación */}
        <Route
            path="/depot/billingmanager"
            element={
            <ProtectedRoute requiredRole="BillingManager">
                <Outlet />
            </ProtectedRoute>
            }
        >
            <Route index element={<BillingManagerDashboard />} />
            <Route path="pending-orders" element={<PendingOrdersPageBilling />} />
            <Route path="pending-orders/:id" element={<PendingOrderDetailsPage />} />
            {/* Alias para soportar la URL usada actualmente */}
            <Route path="pending-billing-orders" element={<PendingOrdersPageBilling />} />
            <Route path="pending-billing-orders/:id" element={<PendingOrderDetailsPage />} />
            <Route path="invoiced-orders" element={<InvoicedOrdersPage />} />
            <Route path="invoiced-orders/:id" element={<InvoicedOrderDetailsPage />} />
            {/**para exportar: */}
            <Route path="exports" element={<InvoicePage/>}/>
            <Route path="exports/:billingOrderId" element={<InvoiceOneDetailPage />} />
            {/**Reportes: */}
            <Route path="reports" element={<DashboardBillingReportsPage/>} />
            <Route path="reports/billingTimeProcess" element={<BillingTimeProcessPage />} />
            <Route path="reports/customerIncome" element={<CustomerIncomePage />} />
            <Route path="reports/orderBilled" element={<OrderBilledPage />} />
        </Route>

        {/* Delivery */}
        {/** 
        <Route
            path="/delivery"
            element={
            <ProtectedRoute requiredRole="Delivery">
                <DeliveryDashboard />
            </ProtectedRoute>
            }
        />*/}

        {/* Verificación */}
        <Route
            path="/verification"
            element={
                <ProtectedRoute requiredRole="VerificationManager">
                    <Outlet/>
                </ProtectedRoute>
            }
        >
            <Route index element={<VerificationManagerDashboardPage/>} />
            <Route path="teams-verification" element={<TeamsPageVerification/>} />
            <Route path="pending-orders-verification" element={<PendingOrdersVerificationPage/>} />
            <Route path="pending-orders-verification/:id" element={<PendingOrdersVerificationDetailsPage/> } />
            <Route path="orders-in-route" element={<OrdersInRoutePage/> } />
            <Route path="orders-in-route/:id" element={<OrdersInRouteDetailsPage/> } />
            {/**reportes sector logistica*/}
            <Route path="reports" element={<DashboardLogisticReportsPage/>} />
            
            <Route path="reports/OrderIncidents" element={<DeliveryIncidentsPage/>} />
            <Route path="reports/RejectOrders" element={<DeliveryRejectionsPage />} />
            <Route path="reports/OrderStatus" element={<OrdersByStatusReportPage/>} />
            <Route path="reports/OrderStatusHistory" element={<OrderStatusHistoryReportPage/>} />
            <Route path="reports/TeamDeliveryProdictivity" element={<DeliveryTeamActivityPage/>} />
            <Route path="reports/PendingCashVerification" element={<PendingCashVerificationPage/>} />
            <Route path="reports/OperatorProdictivity" element={<OperatorProductivityPage/>} />
            <Route path="reports/DeliveryTimes" element={<DeliveryTimesReportPage />} /> 
            <Route path="reports/ZonePerfomance" element={<ZonePerformanceReportPage/>} />
        </Route>

        {/* Admin */}
        <Route
            path="/admin"
            element={
            <ProtectedRoute requiredRole="Admin">
                <div>Bienvenido al panel de Administración</div>
            </ProtectedRoute>
            }
        />
      </Routes>
    
  );
};

export default AppRouter;