import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import Orders from "./Components/Orders/Orders";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/profile" />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/profile"
        element={
          token ? (
            <Home />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/product/:id"
        element={
          token ? (
            <ProductDetails />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/orders"
        element={
          token ? (
            <Orders />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/profile" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

export default App;