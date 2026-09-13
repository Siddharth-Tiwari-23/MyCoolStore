import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/chat`;

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();
    return {
      ...data,
      success: data.success !== undefined ? data.success : response.ok,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unable to reach chat server",
    };
  }
};
