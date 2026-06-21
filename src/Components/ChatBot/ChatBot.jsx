import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { sendChatMessage } from "../../services/chatService";

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am CoolBot. Ask me anything.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    try {
      const data =
        await sendChatMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "No response received",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Server Error",
        },
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl z-50"
      >
        {open ? <FaTimes /> : <FaRobot />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white border rounded-xl shadow-2xl flex flex-col z-50">

          <div className="bg-blue-600 text-white p-4 rounded-t-xl font-bold">
            CoolBot Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex border-t">
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Type here..."
              className="flex-1 p-3 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-5"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatBot;