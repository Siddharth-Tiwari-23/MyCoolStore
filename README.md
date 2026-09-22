# MyCoolStore – Production-Grade Full-Stack E-Commerce Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Frontend%20Live-black?logo=vercel)](https://my-cool-store-chi.vercel.app/)
[![Render Backend](https://img.shields.io/badge/Render-Backend%20API-46E3B7?logo=render)](https://mycoolstore.onrender.com)
[![Razorpay Integrated](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0C2340?logo=razorpay)](https://razorpay.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20MVC-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)

MyCoolStore is a modern, production-grade full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It features secure JWT authentication, dynamic database-backed product catalog, role-based admin controls (RBAC), atomic inventory deduction with concurrency protection, official Razorpay payment gateway integration, live order tracking, and an AI-powered shopping assistant powered by Google Gemini.

**Live Storefront:** [https://my-cool-store-chi.vercel.app/](https://my-cool-store-chi.vercel.app/)  
**Backend API:** [https://mycoolstore.onrender.com](https://mycoolstore.onrender.com)

---

## 🌟 Key Engineering Highlights

### 1. Payment Gateway & Cryptographic Security
- **Official Razorpay Checkout Integration**: Integrated `checkout.js` with client-side script loader and server-side Orders API (`razorpay` npm package).
- **Multi-Method Support**: Full checkout popup supporting **UPI (Google Pay, PhonePe, Paytm, BHIM)**, **QR Code scanning**, **Credit/Debit Cards (Visa, Mastercard, RuPay)**, and **NetBanking**.
- **HMAC-SHA256 Cryptographic Verification**: The server independently verifies payment authenticity by hashing `razorpay_order_id|razorpay_payment_id` with `RAZORPAY_KEY_SECRET` before marking transactions as paid.
- **Server-Side Authoritative Pricing**: Subtotals, shipping fees, and taxes are strictly calculated on the server from database records to prevent client-side price tampering.

### 2. High-Concurrency Inventory Protection
- **Atomic Stock Deduction**: When placing an order, inventory stock is atomically decremented with MongoDB's `$inc` and `$gte` conditions:
  ```javascript
  await Product.findOneAndUpdate(
    { _id: dbProduct._id, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );
  ```
  This guarantees zero overselling or race conditions under concurrent checkouts.

### 3. Role-Based Access Control (RBAC) & Admin Portal
- **Strict Role Separation**: Secure authorization barrier between customers (`role: 'user'`) and store managers (`role: 'admin'`).
- **Protected Admin Route Guard**: Custom Express `adminMiddleware` returns `403 Forbidden` for unauthorized API calls; client-side `<AdminRoute>` guards the portal.
- **Admin Management Portal (`/admin`)**:
  - **Overview Analytics**: Real-time stats for revenue, total orders, active orders, and low-stock alerts.
  - **Product Inventory CRUD**: Add new products, adjust live stock levels, modify pricing, and delete catalog items.
  - **Order Fulfillment Controls**: Advance customer orders through the live state machine (`Pending` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`).

### 4. Real-Time Order Tracking & UX
- **Live Tracking Stepper**: Visual 4-stage stepper on `/orders` (`Placed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`) updating in real-time.
- **Seamless Order Confirmation**: Instant order placement modal with 1-click **"Track Order 📦"** redirection.
- **Unified DB-Synced Cart & Wishlist**: Cart items and quantities persist across page reloads and cross-device logins in MongoDB.

### 5. AI Shopping Assistant
- Integrated with **Google Gemini API** (`@google/generative-ai`) to provide real-time conversational product recommendations, styling suggestions, and store assistance.

### 6. Performance & Core Web Vitals
- **99% Asset Optimization**: Converted uncompressed image assets into lightweight, high-fidelity `.webp` formats, shrinking total asset size from 101.6 MB to under 1 MB.
- Implemented `loading="lazy"` and `decoding="async"` across the storefront for instant First Contentful Paint.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router DOM, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js (Modular MVC architecture)
- **Database**: MongoDB Atlas, Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js password hashing
- **Payments**: Razorpay API, Node.js Crypto (HMAC-SHA256 signature verification)
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Hosting & CI/CD**: Vercel (Frontend SPA), Render (Backend API Service)

---

## 📁 Project Structure

```text
MyCoolStore/
├── public/                 # Static assets & favicons
├── server/
│   ├── config/             # MongoDB connection setup
│   ├── controllers/        # MVC Controllers (auth, product, order, chat)
│   ├── middlewares/        # JWT auth & adminMiddleware guards
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # Express API routes
│   ├── data/               # Default catalog & auto-seeding data
│   └── server.js           # Express app entry point
│
├── src/
│   ├── Components/
│   │   ├── Admin/          # Admin dashboard & route guard
│   │   ├── Banner/         # Responsive promo hero banner
│   │   ├── Cart/           # Drawer cart with live DB sync
│   │   ├── ChatBot/        # Gemini AI shopping assistant
│   │   ├── Home/           # Main storefront page
│   │   ├── Login/          # Authentication & Render cold-start UX feedback
│   │   ├── Navbar/         # Header with cart, search & navigation
│   │   ├── OrderPlace/     # Post-checkout confirmation & tracking launcher
│   │   ├── OrderSummary/   # Checkout breakdown & Razorpay gateway launcher
│   │   ├── Orders/         # Order history & live tracking stepper
│   │   ├── ProductDetails/ # Detailed product view with size selector
│   │   ├── Products/       # Product grid with category filters
│   │   └── Wishlist/       # Saved items drawer
│   │
│   ├── assets/             # High-performance WebP images
│   ├── services/           # Frontend API client modules
│   ├── config.js           # Centralized environment API config
│   ├── App.jsx             # React Router route definitions
│   └── main.jsx            # React root mount
│
├── package.json
└── vercel.json             # SPA routing rewrite configuration
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new customer account |
| POST | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| GET | `/api/auth/profile` | Authenticated | Retrieve authenticated user profile |
| POST | `/api/auth/cart/update` | Authenticated | Persist cart item quantities in database |
| POST | `/api/auth/toggle-role`| Authenticated | Switch demo role between User and Admin |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products (with search, category filter, sorting) |
| GET | `/api/products/:id` | Public | Retrieve single product details |
| POST | `/api/products` | Admin Only | Add new product to catalog |
| PUT | `/api/products/:id` | Admin Only | Update product details or stock inventory |
| DELETE| `/api/products/:id` | Admin Only | Remove product from store |

### Orders & Payments (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders/razorpay-create` | Authenticated | Generate official Razorpay Order ID |
| POST | `/api/orders/razorpay-verify` | Authenticated | Verify HMAC-SHA256 payment signature |
| POST | `/api/orders/place` | Authenticated | Place order with atomic stock decrement |
| GET | `/api/orders/my-orders`| Authenticated | Retrieve customer's order history |
| GET | `/api/orders/all` | Admin Only | Retrieve all store orders |
| PUT | `/api/orders/:id/status` | Admin Only | Advance order state machine (`Processing`/`Shipped`/`Delivered`) |

### AI Shopping Assistant (`/api/chat`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/chat` | Public | Chat with Gemini AI shopping assistant |

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Siddharth-Tiwari-23/MyCoolStore.git
cd MyCoolStore
```

### 2. Setup Backend Server
```bash
cd server
npm install
cp .env.example .env
```
Configure `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Run the backend:
```bash
npm run dev
```

### 3. Setup Frontend Client
```bash
# In the root directory
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👤 Author

**Siddharth Tiwari**
- GitHub: [@Siddharth-Tiwari-23](https://github.com/Siddharth-Tiwari-23)
- Project Repository: [MyCoolStore](https://github.com/Siddharth-Tiwari-23/MyCoolStore)