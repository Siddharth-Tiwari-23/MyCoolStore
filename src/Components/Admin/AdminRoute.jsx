import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    alert("Admin privileges required to access the Admin Portal.");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
