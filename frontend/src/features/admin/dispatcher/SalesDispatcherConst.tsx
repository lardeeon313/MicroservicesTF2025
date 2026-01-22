import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../../auth/context/useAuth";
import { AdminDashboardSalesReportPage } from "../pages/AdminDashboardFeatures/AdminDashboardSalesReport";

const SalesDispatcherReportsIndex = () => {
  const { token } = useAuth();
  const role = token ? getRoleFromToken(token) : null;

  // Admin
  if (role === "Admin") {
    return <Navigate to="/sales/reports/admin" replace />;
  }

  
  return <AdminDashboardSalesReportPage />;
};

export default SalesDispatcherReportsIndex;
