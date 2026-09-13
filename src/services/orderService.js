import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/orders`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/place`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/my-orders`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const createRazorpayOrder = async (amount) => {
  const response = await fetch(`${API_URL}/razorpay-create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount }),
  });
  return response.json();
};

export const verifyRazorpayPayment = async (paymentDetails) => {
  const response = await fetch(`${API_URL}/razorpay-verify`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentDetails),
  });
  return response.json();
};

export const getAllOrders = async () => {
  const response = await fetch(`${API_URL}/all`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const updateOrderStatus = async (orderId, status, note = "") => {
  const response = await fetch(`${API_URL}/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, note }),
  });
  return response.json();
};
