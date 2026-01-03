import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../../auth/context/useAuth";
import { DashboardDepotReportsPage } from "../../depot/pages/DashboardDepotReportsPage";

const DepotDispatcherReportsIndex = () => {
  const { token } = useAuth();
  const role = token ? getRoleFromToken(token) : null;

  if (role === "Admin") {
    return <Navigate to="/admin/reports/depot" replace />;
  }

  // DepotManager
  return <DashboardDepotReportsPage />;
};

export default DepotDispatcherReportsIndex;
