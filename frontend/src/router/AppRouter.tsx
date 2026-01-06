import { Routes, Route, Outlet } from "react-router-dom";

// Páginas comunes
import HomePage from "../features/common/pages/HomePage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Unauthorized from "../features/auth/components/Unauthorized";

// Auth
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import CreatePasswordPage from "../features/auth/pages/CreatePasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

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

// Depósito
import DepotManagerDashboard from "../features/depot/depotmanager/pages/DepotManagerDashboard";
import TeamsPage from "../features/depot/depotmanager/pages/TeamsPage";
import PendingOrdersPageDepot from "../features/depot/depotmanager/pages/PendingOrdersPage";
import InPreparationOrdersPage from "../features/depot/depotmanager/pages/InPreparationOrdersPage";
import PreparedOrdersPage from "../features/depot/depotmanager/pages/PreparedOrdersPage";
import MissingOrdersPage from "../features/depot/depotmanager/pages/MissingOrdersPage";
//import { DashboardDepotReportsPage } from "../features/depot/pages/DashboardDepotReportsPage";
import ProcessingTimePage from "../features/depot/pages/reports/Depot/DepotPages/AverageTimeOrderPage";
import DailyMissingPage from "../features/depot/pages/reports/Depot/DepotPages/DailyMissingPage";
import { CompletedOrdersReportPage } from "../features/depot/pages/reports/Depot/DepotPages/OrderCompletedDayPage";
import { DepotTeamPerformancePage } from "../features/depot/pages/reports/Depot/DepotPages/TeamProdictiviyPage";

// Billing
import BillingManagerDashboard from "../features/depot/billingmanager/pages/BillingManagerDashboard";
import PendingOrdersPageBilling from "../features/depot/billingmanager/pages/PendingOrdersPage";
import PendingOrderDetailsPage from "../features/depot/billingmanager/pages/PendingOrderDetailsPage";
import InvoicedOrdersPage from "../features/depot/billingmanager/pages/InvoicedOrdersPage";
import InvoicedOrderDetailsPage from "../features/depot/billingmanager/pages/InvoicedOrderDetailsPage";
import InvoicePage from "../features/depot/billingmanager/pages/InvoiceExportPage";
import InvoiceOneDetailPage from "../features/depot/billingmanager/pages/InvoiceDetailPage";

import CustomerIncomePage from "../features/depot/pages/reports/Billing/BillingPages/CustomerIncomePage";
import OrderBilledPage from "../features/depot/pages/reports/Billing/BillingPages/OrderBilledPage";
import { DashboardBillingReportsPage } from "../features/depot/pages/DashboardBillingDepotPage";

// Verificación
import VerificationManagerDashboardPage from "../features/verification/pages/VerificationManagerDashboard";
import TeamsPageVerification from "../features/verification/pages/TeamsPage";
import PendingOrdersVerificationPage from "../features/verification/pages/PendingOrdersVerficationPage";
import PendingOrdersVerificationDetailsPage from "../features/verification/pages/PendingOrderVerificationDetailsPage";
import OrdersInRoutePage from "../features/verification/pages/OrdersInRoutePage";
import OrdersInRouteDetailsPage from "../features/verification/pages/OrdersInRouteDetailsPage";
//import { DashboardLogisticReportsPage } from "../features/verification/pages/reports/DashboardLogisticReportsPage";
import { DeliveryIncidentsPage } from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryIncidentsPage";
import DeliveryRejectionsPage from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryRejectionsPage";
import { OrdersByStatusReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/OrderByStatusPage";
import { OrderStatusHistoryReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/OrderByStatusHistoryPage";
import DeliveryTeamActivityPage from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryTeamActivityPage";
import { PendingCashVerificationPage } from "../features/verification/pages/reports/Verification/VerificationPages/PendingCashVerificationPage";
import { OperatorProductivityPage } from "../features/verification/pages/reports/Verification/VerificationPages/OperatorProdictivityReportPage";
import { DeliveryTimesReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/DeliveryTimesPage";
import { ZonePerformanceReportPage } from "../features/verification/pages/reports/Verification/VerificationPages/ZonePerfomancePage";

// Admin
import AdminDashboardPage from "../features/admin/pages/AdminDashboard";
import { AdminReportsDashboardPage } from "../features/admin/pages/AdminReportsDashboardPage";
import EmployeesPage from "../features/admin/pages/EmployeesPage";
import RegisterEmployeesPage from "../features/admin/pages/RegisterEmployeesPage";
import EditEmployeesPage from "../features/admin/pages/EditEmployeesPage";
import { AdminDashboardSalesReportPage } from "../features/admin/pages/AdminDashboardFeatures/AdminDashboardSalesReport";
import { AdminDashboardBillingReportPage } from "../features/admin/pages/AdminDashboardFeatures/AdminDashboardBillingReport";
import { AdminDashboardDepotReportPage } from "../features/admin/pages/AdminDashboardFeatures/AdminDashboardDepotReport";
import { AdminDashboardLogisticReportPage } from "../features/admin/pages/AdminDashboardFeatures/AdminDashboardLogisticReport";


//REPORTES DE BILLING PARA ADMIN 
import AdminInvoiceOrdersBilled from "../features/admin/pages/AdminDashboardFeatures/ReportsBilling/Pages/OrderBilledPage";
import AdminCustomerIncomePage from "../features/admin/pages/AdminDashboardFeatures/ReportsBilling/Pages/CustomerIncomePage";

//REPORTES DE DEPOT PARA ADMIN

import AdminAverageProcessingTimePage from "../features/admin/pages/AdminDashboardFeatures/ReportsDepot/Pages/AdminAverageTimeOrderPage";
import AdminReportDailyMissingPage from "../features/admin/pages/AdminDashboardFeatures/ReportsDepot/Pages/AdminDailyMissingPage";
import { AdminReportCompletedOrdersReportPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsDepot/Pages/AdminOrderCompletedDayPage";
import { AdminReportDepotTeamPerformancePage } from "../features/admin/pages/AdminDashboardFeatures/ReportsDepot/Pages/AdminTeamProductivityPage";


//REPORTES DE LOGISTIC PARA ADMIN: 
import { AdminReportDeliveryIncidentsPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminDeliveryIncidentsReportPage";
import AdminReportDeliveryRejectionsPage from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminDeliveryRejectionsReportPage";
import AdminDeliveryTeamActivityPage from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminDeliveryTeamActivityReportPage";
import AdminDeliveryTimesReportPage from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminDeliveryTimesReporPage";
import { AdminReportOperatorProductivityPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminOperatorProductivityReportPage";
import { AdminReportOrderStatusHistoryReportPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminOrderByStatusHistoryPage";
import { AdminReportPendingCashVerificationPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminPendingCashVerficationReportPage";
import { AdminReportZonePerformanceReportPage } from "../features/admin/pages/AdminDashboardFeatures/ReportsLogistics/Pages/AdminZonePerfomanceReportPage";


//Dispatcher: 
import BillingDispatcherReportsIndex from "../features/admin/dispatcher/BillingDispatcherConst";
import DepotDispatcherReportsIndex from "../features/admin/dispatcher/DepotDispatcherConst";
import LogisticDispatcherReportsIndex from "../features/admin/dispatcher/LogisticDispatcherConst";


const AppRouter = () => {
  return (
    <Routes>

      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404notfound" element={<NotFoundPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/create-password" element={<CreatePasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* SALES */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute requiredRoles={["SalesStaff"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/view/:id" element={<ViewOrderPage />} />
        <Route path="orders/registerOrder" element={<RegisterOrderPage />} />
        <Route path="orders/update/:id" element={<EditOrderPage />} />
        <Route path="missing-orders" element={<MissingOrdersSalesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customer/registerCustomer" element={<RegisterCustomerPage />} />
        <Route path="customer/viewCustomer/:id" element={<ViewCustomerPage />} />
        <Route path="customer/update/:id" element={<EditCustomerPage />} />
        <Route path="reports/dashboard" element={<DashboardReportsPage />} />
        <Route path="reports/customersReport" element={<CustomerReportPage />} />
        <Route path="reports/customerSatisfactionReport" element={<CustomerSatisfactionPage />} />
        <Route path="reports/customerStatusReport" element={<CustomerInactiveReportPage />} />
        <Route path="reports/modifiedCanceledReport" element={<ModifiedCanceledOrdersPage />} />
        <Route path="reports/salesPerfomance" element={<SalesPerfomanceReportPage />} />
        <Route path="reports/customerpaymentypereport" element={<CustomerReportPaymentTypePage />} />
      </Route>

      {/* DEPOT OPERATIVO */}
      <Route
        path="/depot"
        element={
          <ProtectedRoute requiredRoles={["DepotManager"]}>
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
      </Route>

      {/* DEPOT REPORTES (Depot + Admin) */}
      <Route
        path="/depot/reports"
        element={
          <ProtectedRoute requiredRoles={["DepotManager", "Admin"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<DepotDispatcherReportsIndex />} />

        {/* DepotManager */}
        <Route path="averageTimeOrder" element={<ProcessingTimePage />} />
        <Route path="dailyMissing" element={<DailyMissingPage />} />
        <Route path="orderCompletedDay" element={<CompletedOrdersReportPage />} />
        <Route path="teamProdictivity" element={<DepotTeamPerformancePage />} />

        {/* Admin */}
        <Route path="admin/averageTimeOrder" element={<AdminAverageProcessingTimePage />} />
        <Route path="admin/dailyMissing" element={<AdminReportDailyMissingPage />} />
        <Route path="admin/orderCompletedDay" element={<AdminReportCompletedOrdersReportPage />} />
        <Route path="admin/teamProdictivity" element={<AdminReportDepotTeamPerformancePage />} />
      </Route>

      {/* BILLING OPERATIVO */}
      <Route
        path="/depot/billingmanager"
        element={
          <ProtectedRoute requiredRoles={["BillingManager"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<BillingManagerDashboard />} />
        <Route path="pending-orders" element={<PendingOrdersPageBilling />} />
        <Route path="pending-orders/:id" element={<PendingOrderDetailsPage />} />
        <Route path="invoiced-orders" element={<InvoicedOrdersPage />} />
        <Route path="invoiced-orders/:id" element={<InvoicedOrderDetailsPage />} />
        <Route path="exports" element={<InvoicePage />} />
        <Route path="exports/:billingOrderId" element={<InvoiceOneDetailPage />} />
        <Route path="reports/" element={<DashboardBillingReportsPage/>} />

      </Route>

      {/* BILLING REPORTES (Billing + Admin) */}

      <Route
        path="/depot/billingmanager/reports"
        element={
          <ProtectedRoute requiredRoles={["BillingManager", "Admin"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<BillingDispatcherReportsIndex />} />

        {/* Billing */}
        <Route
          path="customerIncome"
          element={<CustomerIncomePage />}
        />
        <Route
          path="orderBilled"
          element={<OrderBilledPage />}
        />

        {/* Admin */}
        <Route
          path="admin/customerIncome"
          element={<AdminCustomerIncomePage />}
        />
        <Route
          path="admin/orderBilled"
          element={<AdminInvoiceOrdersBilled />}
        />
      </Route>


      {/* VERIFICATION */}
      <Route
        path="/verification"
        element={
          <ProtectedRoute requiredRoles={["VerificationManager"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<VerificationManagerDashboardPage />} />
        <Route path="teams-verification" element={<TeamsPageVerification />} />
        <Route path="pending-orders-verification" element={<PendingOrdersVerificationPage />} />
        <Route path="pending-orders-verification/:id" element={<PendingOrdersVerificationDetailsPage />} />
        <Route path="orders-in-route" element={<OrdersInRoutePage />} />
        <Route path="orders-in-route/:id" element={<OrdersInRouteDetailsPage />} />
      </Route>

      <Route
        path="/verification/reports"
        element={
          <ProtectedRoute requiredRoles={["VerificationManager", "Admin"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        {/* Dispatcher */}
        <Route index element={<LogisticDispatcherReportsIndex />} />

        {/* REPORTES OPERATIVOS (VerificationManager) */}
        <Route path="OrderIncidents" element={<DeliveryIncidentsPage />} />
        <Route path="RejectOrders" element={<DeliveryRejectionsPage />} />
        <Route path="OrderStatus" element={<OrdersByStatusReportPage />} />
        <Route path="OrderStatusHistory" element={<OrderStatusHistoryReportPage />} />
        <Route path="TeamDeliveryProdictivity" element={<DeliveryTeamActivityPage />} />
        <Route path="PendingCashVerification" element={<PendingCashVerificationPage />} />
        <Route path="OperatorProdictivity" element={<OperatorProductivityPage />} />
        <Route path="DeliveryTimes" element={<DeliveryTimesReportPage />} />
        <Route path="ZonePerfomance" element={<ZonePerformanceReportPage />} />

        {/* REPORTES ADMIN */}
        <Route path="admin/OrderIncidents" element={<AdminReportDeliveryIncidentsPage />} />
        <Route path="admin/RejectOrders" element={<AdminReportDeliveryRejectionsPage />} />
        <Route path="admin/OrderStatusHistory" element={<AdminReportOrderStatusHistoryReportPage />} />
        <Route path="admin/TeamDeliveryProdictivity" element={<AdminDeliveryTeamActivityPage />} />
        <Route path="admin/PendingCashVerification" element={<AdminReportPendingCashVerificationPage />} />
        <Route path="admin/OperatorProdictivity" element={<AdminReportOperatorProductivityPage />} />
        <Route path="admin/DeliveryTimes" element={<AdminDeliveryTimesReportPage />} />
        <Route path="admin/ZonePerfomance" element={<AdminReportZonePerformanceReportPage />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={["Admin"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="reports" element={<AdminReportsDashboardPage />} />
        <Route path="reports/sales" element={<AdminDashboardSalesReportPage />} />
        <Route path="reports/depot" element={<AdminDashboardDepotReportPage />} />
        <Route path="reports/billing" element={<AdminDashboardBillingReportPage />} />
        <Route path="reports/logistics" element={<AdminDashboardLogisticReportPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/register" element={<RegisterEmployeesPage />} />
        <Route path="employees/edit/:id" element={<EditEmployeesPage />} />
      </Route>

    </Routes>
  );
};

export default AppRouter;
