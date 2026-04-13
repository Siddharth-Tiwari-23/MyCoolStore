👜 MyCoolStore
A high-performance, responsive E-Commerce storefront built with React, Vite, and Tailwind CSS. This project showcases professional state management, custom hooks, and persistent data handling tailored for modern web standards.

🚀 Features
🛒 Persistent Cart & Wishlist: Implemented custom logic using localStorage to ensure user selections are retained across browser sessions.

⚡ Optimized Filtering: Real-time category filtering and search functionality utilizing the useMemo hook to minimize re-renders and maximize performance.

⏳ Sales Timer: A synchronized, persistent countdown timer integrated into the Banner component to track limited-time offers.

📱 Responsive UI: Mobile-first design architecture using Tailwind CSS, featuring smooth, z-index prioritized side-drawer panels for an app-like experience.

💳 Checkout Flow: A multi-step order simulation that manages state transitions from validation in the OrderSummary to the final OrderPlaced success state.

🛠️ Tech Stack
Frontend: React.js (v18+)

Styling: Tailwind CSS

Icons: React Icons (Fa, Go)

Build Tool: Vite

State Management: React Hooks (useState, useEffect, useMemo)

📂 Project Structure
Plaintext
src/
├── assets/             # Project images and global media
├── Components/         # Modular and reusable UI components
│   ├── Banner/         # Sales banner with countdown logic
│   ├── Cart/           # Side-drawer cart management
│   ├── Navbar/         # Navigation & real-time search
│   ├── Products/       # Product grid & filtering logic
│   └── OrderSummary/   # Checkout validation flow
├── Home.jsx            # Centralized State Controller
└── ProductList.js      # Centralized product data configuration
⚙️ Setup
Clone the repository:

Bash
git clone https://github.com/Siddharth-Tiwari-23/MyCoolStore.git
Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
📌 Future Enhancements
Authentication 🔐: Implementing Firebase or JWT for user accounts.

Payment Integration 💰: Integrating Stripe or Razorpay for real transactions.

Order History 📦: Creating a user dashboard to track previous purchases.

Backend Integration 🌐: Moving from local data to a full MERN stack (MongoDB, Express, Node.js).

Author: Siddharth Tiwari | NIT Bhopal (MANIT)
