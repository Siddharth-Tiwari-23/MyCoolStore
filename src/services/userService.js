const API_URL = "https://mycoolstore.onrender.com/api/auth";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const addWishlistItem = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/wishlist/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );

  return await response.json();
};

export const removeWishlistItem = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/wishlist/remove`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );

  return await response.json();
};

export const addCartItem = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/cart/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );

  return await response.json();
};

export const removeCartItem = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/cart/remove`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }
  );

  return await response.json();
};
