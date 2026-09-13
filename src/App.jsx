import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import Orders from "./Components/Orders/Orders";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminRoute from "./Components/Admin/AdminRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Storefront */}
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Home />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          token ? <Navigate to="/" replace /> : <Register />
        }
      />

      {/* Product Details - Public */}
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Protected Routes */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;