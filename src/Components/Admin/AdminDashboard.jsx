import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Men",
    price: "",
    oldPrice: "",
    stock: "50",
    image: "",
    description: "",
    onSale: false,
    newArrival: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetchProducts(),
        getAllOrders(),
      ]);

      if (prodRes.products) setProducts(prodRes.products);
      if (orderRes.orders) setOrders(orderRes.orders);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing").length;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 15).length;

  // Product Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id || editingProduct.id, productForm);
        if (res.success) {
          alert("Product updated successfully!");
        }
      } else {
        const res = await createProduct(productForm);
        if (res.success) {
          alert("New product added to catalog!");
        }
      }
      setShowAddModal(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "Men",
        price: "",
        oldPrice: "",
        stock: "50",
        image: "",
        description: "",
        onSale: false,
        newArrival: true,
      });
      loadData();
    } catch (err) {
      alert(err.message || "Error saving product");
    }
  };

  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || "Men",
      price: prod.price,
      oldPrice: prod.oldPrice || "",
      stock: prod.stock !== undefined ? prod.stock : 50,
      image: prod.image,
      description: prod.description || "",
      onSale: Boolean(prod.onSale),
      newArrival: Boolean(prod.newArrival),
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter((p) => (p._id || p.id) !== id));
      } else {
        alert(res.message || "Could not delete product");
      }
    } catch (err) {
      alert(err.message || "Error deleting product");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus, `Status updated by Admin`);
      if (res.success) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      } else {
        alert(res.message || "Failed to update order status");
      }
    } catch (err) {
      alert(err.message || "Error updating order");
    }
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-brand">
          <h2>MyCoolStore <span>Admin</span></h2>
          <span className="role-badge">Administrator</span>
        </div>

        <div className="admin-header-actions">
          <Link to="/" className="btn-secondary">
            ← View Storefront
          </Link>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📦 Catalog & Inventory ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          🚚 Orders & Tracking ({orders.length})
        </button>
      </nav>

      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <main className="admin-main">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="stat-card">
                <div className="stat-icon revenue-icon">₹</div>
                <div>
                  <p className="stat-title">Total Revenue</p>
                  <h3 className="stat-value">₹{totalRevenue.toLocaleString()}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orders-icon">📦</div>
                <div>
                  <p className="stat-title">Total Orders</p>
                  <h3 className="stat-value">{totalOrders}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon pending-icon">⏳</div>
                <div>
                  <p className="stat-title">Active Orders</p>
                  <h3 className="stat-value">{pendingOrders}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stock-icon">⚠️</div>
                <div>
                  <p className="stat-title">Low Stock Alert</p>
                  <h3 className="stat-value">{lowStockCount}</h3>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="overview-recent-section">
                <div className="section-header">
                  <div>
                    <h3>Recent Orders</h3>
                    <p className="section-subtitle">Latest customer purchases and current delivery statuses.</p>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="empty-state">No orders received yet.</div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord._id}>
                            <td className="code-text">#{ord._id.slice(-6).toUpperCase()}</td>
                            <td>{ord.user?.name || "Customer"}</td>
                            <td>{ord.products?.length || 0} item(s)</td>
                            <td className="font-bold">₹{ord.totalAmount}</td>
                            <td>
                              <span className={`payment-pill ${ord.paymentMethod === "Razorpay" ? "online" : "cod"}`}>
                                {ord.paymentMethod || "COD"}
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill status-${(ord.orderStatus || "Pending").toLowerCase()}`}>
                                {ord.orderStatus || "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="products-view">
              <div className="section-header">
                <div>
                  <h3>Product Catalog Management</h3>
                  <p className="section-subtitle">Add, edit stock levels, adjust prices, or remove items.</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: "",
                      category: "Men",
                      price: "",
                      oldPrice: "",
                      stock: "50",
                      image: "",
                      description: "",
                      onSale: false,
                      newArrival: true,
                    });
                    setShowAddModal(true);
                  }}
                >
                  + Add New Product
                </button>
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const id = p._id || p.id;
                      const stockVal = p.stock !== undefined ? p.stock : 50;
                      return (
                        <tr key={id}>
                          <td>
                            <img src={p.image} alt={p.name} className="product-thumb" />
                          </td>
                          <td className="font-semibold">{p.name}</td>
                          <td>
                            <span className="category-pill">{p.category}</span>
                          </td>
                          <td className="font-bold">₹{p.price}</td>
                          <td>
                            <span className={`stock-badge ${stockVal <= 15 ? "low" : "ok"}`}>
                              {stockVal} units {stockVal <= 15 ? "(Low)" : ""}
                            </span>
                          </td>
                          <td>
                            {p.onSale && <span className="tag-sale">Sale</span>}
                            {p.newArrival && <span className="tag-new">New</span>}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn-table-edit"
                                onClick={() => handleEditClick(p)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-table-del"
                                onClick={() => handleDeleteProduct(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="orders-view">
              <div className="section-header">
                <div>
                  <h3>Customer Orders & Lifecycle</h3>
                  <p className="section-subtitle">
                    Manage order fulfillment. Changing status here updates the customer's live tracking stepper.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">No customer orders placed yet.</div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Order Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => {
                        const customer = ord.user || {};
                        return (
                          <tr key={ord._id}>
                            <td className="code-text">#{ord._id.slice(-6).toUpperCase()}</td>
                            <td>
                              <div className="customer-info">
                                <strong>{customer.name || "Customer"}</strong>
                                <span>{customer.email || "N/A"}</span>
                              </div>
                            </td>
                            <td>
                              <span className="items-badge">
                                {ord.products?.length || 0} product(s)
                              </span>
                            </td>
                            <td className="font-bold">₹{ord.totalAmount}</td>
                            <td>
                              <span className={`payment-pill ${ord.paymentMethod === "Razorpay" ? "online" : "cod"}`}>
                                {ord.paymentMethod || "COD"} • {ord.paymentStatus || "Pending"}
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill status-${(ord.orderStatus || "Pending").toLowerCase()}`}>
                                {ord.orderStatus || "Pending"}
                              </span>
                            </td>
                            <td>
                              <select
                                className="status-select"
                                value={ord.orderStatus || "Pending"}
                                onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton Polo Shirt"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 499"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 699"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of product features..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={productForm.onSale}
                    onChange={(e) => setProductForm({ ...productForm, onSale: e.target.checked })}
                  />
                  Mark as On Sale
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={productForm.newArrival}
                    onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                  />
                  New Arrival
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
