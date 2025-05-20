import {  Routes, Route } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Unauthorized from "../features/auth/components/Unauthorized";
import DeliveryDashboard from "../features/delivery/pages/DeliveryDashboard";
import DepotManagerDashboard from "../features/depot/depotmanager/pages/DepotManagerDashboard";
import OperatorDashboard from "../features/depot/operator/pages/OperatorDashboard";
import BillingManagerDashboard from "../features/depot/billingmanager/pages/BillingManagerDashboard";
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
import { DashboardReportsPage } from "../features/sales/pages/reports/DashboardReportsPage";

const AppRouter = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="/404notfound" element={<NotFoundPage/>}/>
        <Route path="/" element={<HomePage/>}></Route>


        <Route path="/sales" element={<DashboardPage/>}/>
        <Route path="/sales/orders" element={<OrdersPage/>}/>
        <Route path="/sales/orders/view/:id" element={<ViewOrderPage/>} />
        <Route path="/sales/orders/registerOrder" element={<RegisterOrderPage/>}/>
        <Route path="/sales/orders/update/:id" element={<EditOrderPage/>}/>
        <Route path="/sales/customer/registerCustomer" element={<RegisterCustomerPage/>}/>
        <Route path="/sales/customer/viewCustomer/:id" element={<ViewCustomerPage/>}/>
        <Route path="/sales/customers" element={<CustomersPage/>}/>
        <Route path="/sales/customer/update/:id" element={<EditCustomerPage/>}/>
        <Route path="/sales/reports" element={<DashboardReportsPage/>}/>





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
            path="/sales"
            element = {
                <ProtectedRoute requiredRole="SalesStaff">
                    <DashboardPage/>
                </ProtectedRoute>
            }>
        </Route>

        <Route
            path="/depot/warehousemanager"
            element = {
                <ProtectedRoute requiredRole="WarehouseManager">
                    <DepotManagerDashboard/>
                </ProtectedRoute>
            }>
        </Route>

        <Route
            path="/depot/operator"
            element = {
                <ProtectedRoute requiredRole="Operator">
                    <OperatorDashboard/>
                </ProtectedRoute>
            }>
        </Route>

        <Route
            path="/depot/billingmanager"
            element = {
                <ProtectedRoute requiredRole="BillingManager">
                    <BillingManagerDashboard/>
                </ProtectedRoute>
            }>
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
