import { API_BASE_URL } from "../config";
import { products as fallbackProducts } from "../Components/Products/ProductList";

const API_URL = `${API_BASE_URL}/api/products`;

export const fetchProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}${query ? `?${query}` : ""}`);
    const data = await response.json();

    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return {
        success: true,
        products: data.products.map((p) => ({
          ...p,
          id: p._id || p.id,
        })),
      };
    }
  } catch (err) {
    console.warn("Backend products fetch failed, falling back to local catalog:", err.message);
  }

  // Graceful offline/local fallback
  return {
    success: true,
    products: fallbackProducts,
  };
};

export const createProduct = async (productData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id, updateData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
