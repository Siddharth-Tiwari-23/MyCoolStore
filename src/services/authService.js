const API_URL = "https://mycoolstore.onrender.com/api/auth";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const addWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/wishlist/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  return await response.json();
};

export const removeWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/wishlist/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  return await response.json();
};

export const addCart = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  return await response.json();
};

export const removeCart = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  return await response.json();
};
