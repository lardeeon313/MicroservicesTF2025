import {  Routes, Route, Outlet } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Unauthorized from "../features/auth/components/Unauthorized";
import DeliveryDashboard from "../features/delivery/pages/DeliveryDashboard";
import BillingManagerDashboard from "../features/depot/billingmanager/pages/BillingManagerDashboard";
import BillingPendingOrdersPage from "../features/depot/billingmanager/pages/PendingOrdersPage";
import BillingPendingOrderDetailsPage from "../features/depot/billingmanager/pages/PendingOrderDetailsPage";
import BillingInvoicedOrdersPage from "../features/depot/billingmanager/pages/InvoicedOrdersPage";
import BillingInvoicedOrderDetailsPage from "../features/depot/billingmanager/pages/InvoicedOrderDetailsPage";
import VerificationDashboard from "../features/verification/pages/VerificationDashboard";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import HomePage from "../features/common/pages/HomePage";
import OrdersPage from "../features/sales/pages/orders/OrdersPage";
import RegisterOrderPage from "../features/sales/pages/orders/RegisterOrderPage";
import RegisterCustomerPage from "../features/sales/pages/customers/RegisterCustomerPage";
import ViewCustomerPage from "../features/sales/pages/customers/ViewCustomerPage";
import ViewOrderPage from "../features/sales/pages/orders/ViewOrderPage";
import EditOrderPage from "../features/sales/pages/orders/EditOrderPage";
import EditCustomerPage from "../features/sales/pages/customers/EditCustomerPage";
import CustomersPage from "../features/sales/pages/customers/CustomersPage";
import { DashboardPage } from "../features/sales/pages/DashboardPage";
import { DashboardReportsPage } from "../features/sales/pages/DashboardReportsPage";
import CustomerReportPage from "../features/sales/pages/reports/CustomerReportPage";
import CustomerSatisfactionPage from "../features/sales/pages/reports/CustomerSatisfactionReportPage";
import CustomerInactiveReportPage from "../features/sales/pages/reports/CustomerInactiveReportPage";
import ModifiedCanceledOrdersPage from "../features/sales/pages/reports/ModifiedCanceledOrdersPage";
import { SalesPerfomanceReportPage } from "../features/sales/pages/reports/SalesPerfomanceReportPage";
import TeamsPage from "../features/depot/depotmanager/pages/TeamsPage";
import DepotManagerDashboard from "../features/depot/depotmanager/pages/DepotManagerDashboard";
import PendingOrdersPage from "../features/depot/depotmanager/pages/PendingOrdersPage";
import InPreparationOrdersPage from "../features/depot/depotmanager/pages/InPreparationOrdersPage";
import PreparedOrdersPage from "../features/depot/depotmanager/pages/PreparedOrdersPage";
import MissingOrdersPage from "../features/depot/depotmanager/pages/MissingOrdersPage";

const AppRouter = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="/404notfound" element={<NotFoundPage/>}/>
        <Route path="/" element={<HomePage/>}></Route>
        

        <Route
        path="/sales"
        element={
            <ProtectedRoute requiredRole="SalesStaff">
            <Outlet />
            </ProtectedRoute>
        }
        >
        <Route path="home" element={<DashboardPage/>}/>
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/view/:id" element={<ViewOrderPage />} />
        <Route path="orders/registerOrder" element={<RegisterOrderPage />} />
        <Route path="orders/update/:id" element={<EditOrderPage />} />
        <Route path="customer/registerCustomer" element={<RegisterCustomerPage />} />
        <Route path="customer/viewCustomer/:id" element={<ViewCustomerPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customer/update/:id" element={<EditCustomerPage />} />
        <Route path="reports/dashboard" element={<DashboardReportsPage />} />
        <Route path="reports/customersReport" element={<CustomerReportPage/>}/>
        <Route path="reports/customerSatisfactionReport" element={<CustomerSatisfactionPage/>}/>
        <Route path="reports/customerStatusReport" element={<CustomerInactiveReportPage />}/>
        <Route path="reports/modifiedCanceledReport" element={<ModifiedCanceledOrdersPage/>}/>
        <Route path="reports/salesPerfomance" element={<SalesPerfomanceReportPage/>}/>
        </Route>
        


        <Route 
            path="/admin" 
            element = {
                <ProtectedRoute requiredRole="Admin">
                    <div>Bienvenido al panel de Administracion</div>
                </ProtectedRoute>
            }>    
        </Route>

        <Route
            path="/delivery"
            element = {
                <ProtectedRoute requiredRole="Delivery">
                    <DeliveryDashboard/>
                </ProtectedRoute>
            }>
        </Route>


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
                <Route path="pending-orders" element={<PendingOrdersPage />} />
                <Route path="in-preparation-orders" element={<InPreparationOrdersPage />} />
                <Route path="prepared-orders" element={<PreparedOrdersPage />} />
                <Route path="missing-orders" element={<MissingOrdersPage />} />
                <Route path="reports" element={<div>Reportes</div>} />
            </Route>
       




        <Route
            path="/depot/billingmanager"
            element={
                <ProtectedRoute requiredRole="BillingManager">
                    <Outlet />
                </ProtectedRoute>
            }
        >
            <Route index element={<BillingManagerDashboard />} />
            <Route path="pending-orders" element={<BillingPendingOrdersPage />} />
            <Route path="pending-orders/:id" element={<BillingPendingOrderDetailsPage />} />
            <Route path="invoiced-orders" element={<BillingInvoicedOrdersPage />} />
            <Route path="invoiced-orders/:id" element={<BillingInvoicedOrderDetailsPage />} />
            {/* <Route path="reports" element={<BillingManagerReportsPage />} /> */}
        </Route>

        <Route
            path="/verification"
            element = {
                <ProtectedRoute requiredRole="VerificationStaff">
                    <VerificationDashboard/>
                </ProtectedRoute>
            }>
        </Route>

      </Routes>
    
  );
};

export default AppRouter;
