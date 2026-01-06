import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../../auth/context/useAuth";
import { DashboardLogisticReportsPage } from "../../verification/pages/reports/DashboardLogisticReportsPage";

const LogisticDispatcherReportsIndex = () => {
  const { token } = useAuth();
  const role = token ? getRoleFromToken(token) : null;

  if (role === "Admin") {
    return <Navigate to="/admin/reports/logistics" replace />;
  }

  // VerificationManager
  return <DashboardLogisticReportsPage />;
};

export default LogisticDispatcherReportsIndex;
