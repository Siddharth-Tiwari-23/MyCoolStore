const API_URL = "http://localhost:5000/api/chat";

export const sendChatMessage = async (message) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  return await response.json();
};