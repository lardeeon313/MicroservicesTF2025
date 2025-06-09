import {  Routes, Route, Outlet } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Unauthorized from "../features/auth/components/Unauthorized";
import DeliveryDashboard from "../features/delivery/pages/DeliveryDashboard";

import DepotManagerDashboard from "../features/depot/depotmanager/pages/DepotManagerDashboard";
import OperatorDashboard from "../features/depot/operator/navigation/OperatorDashboard";

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
import { DashboardReportsPage } from "../features/sales/pages/DashboardReportsPage";


import CustomerInactiveReportPage from "../features/sales/pages/reports/CustomerInactiveReportPage";
import CustomerReportPage from "../features/sales/pages/reports/CustomerReportPage";
import CustomerSatisfactionReportPage from "../features/sales/pages/reports/CustomerSatisfactionReportPage";
import ModifiedCanceledOrdersPage from "../features/sales/pages/reports/ModifiedCanceledOrdersPage";
import {SalesPerfomanceReportPage}  from "../features/sales/pages/reports/SalesPerfomanceReportPage";

//REPORTES DE DEPOSITO : 
import AverageTimeOrderPage from "../features/depot/pages/reports/Depot/DepotPages/AverageTimeOrderPage";
import DailyMissingPage from "../features/depot/pages/reports/Depot/DepotPages/DailyMissingPage";
import OrderCompletedDayPage from "../features/depot/pages/reports/Depot/DepotPages/OrderCompletedDayPage";
import TeamProdictivityPage from "../features/depot/pages/reports/Depot/DepotPages/TeamProdictiviyPage";

//REPORTES DE FACTURACION
import BillingTimeProcessPage from "../features/depot/pages/reports/Billing/BillingPages/BillingTimeProcessPage";
import CustomerIncomePage from "../features/depot/pages/reports/Billing/BillingPages/CustomerIncomePage";
import OrderBilledPage from "../features/depot/pages/reports/Billing/BillingPages/OrderBilledPage";

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


        {/**reportes de ventas*/}
        <Route path="/sales/reports/customerStatusReport" element={<CustomerInactiveReportPage/>} />
        <Route path="/sales/reports/customersReport" element={<CustomerReportPage/>}/> 
        <Route path="/sales/reports/customerSatisfactionReport" element={<CustomerSatisfactionReportPage/>}/>
        <Route path="/sales/reports/modifiedCanceledReport" element={<ModifiedCanceledOrdersPage/>}/>
        <Route path="/sales/reports/salesPerfomance" element={<SalesPerfomanceReportPage/>}/>

        {/**Reportes de deposito  */}
        <Route path="/depot/depotmanager/report/AverageTimeOrder" element={<AverageTimeOrderPage/>}/>
        <Route path="/depot/depotmanager/report/DailyMissing" element={<DailyMissingPage/>}/>
        <Route path="/depot/depotmanager/report/OrderCompletedDay" element={<OrderCompletedDayPage/>}/>
        <Route path="/depot/depotmanager/report/TeamProdictivity" element={<TeamProdictivityPage/>}/>


        {/**Reportes de facturacion */}
        <Route path="/depot/billingmanager/report/BillingTimeProcess" element={<BillingTimeProcessPage/>}/>
        <Route path="/depot/billingmanager/report/CustomerIncome" element={<CustomerIncomePage/>}/>
        <Route path="/depot/billingmanager/report/OrderBilled" element={<OrderBilledPage/>}/>

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
