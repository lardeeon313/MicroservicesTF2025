import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../../auth/context/useAuth";
import { DashboardBillingReportsPage } from "../../depot/pages/DashboardBillingDepotPage";

const BillingDispatcherReportsIndex = () => {
  const { token } = useAuth();
  const role = token ? getRoleFromToken(token) : null;

  if (role === "Admin") {
    return <Navigate to="/admin/reports/billing" replace />;
  }

  return <DashboardBillingReportsPage />;
};
export default BillingDispatcherReportsIndex;
