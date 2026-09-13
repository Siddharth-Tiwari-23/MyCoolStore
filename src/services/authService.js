import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/auth`;

const safeJsonFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return {
      ...data,
      success: data.success !== undefined ? data.success : response.ok,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};

export const registerUser = async (userData) => {
  return safeJsonFetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (userData) => {
  return safeJsonFetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No token found" };

  return safeJsonFetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/wishlist/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
};

export const removeWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/wishlist/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
};

export const addCart = async (productId) => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
};

export const updateCartQuantity = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/cart/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
};

export const removeCart = async (productId) => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
};

export const clearCart = async () => {
  const token = localStorage.getItem("token");

  return safeJsonFetch(`${API_URL}/cart/clear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleDemoRole = async () => {
  const token = localStorage.getItem("token");
  return safeJsonFetch(`${API_URL}/toggle-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Aliases for compatibility
export const addWishlistItem = addWishlist;
export const removeWishlistItem = removeWishlist;
export const addCartItem = addCart;
export const removeCartItem = removeCart;
