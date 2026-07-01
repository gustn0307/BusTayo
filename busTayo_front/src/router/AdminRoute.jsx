import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const role = sessionStorage.getItem("role");

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;