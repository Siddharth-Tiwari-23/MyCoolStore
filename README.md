# MyCoolStore – Production-Grade Full-Stack E-Commerce Platform

MyCoolStore is a modern, production-grade full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It features secure JWT authentication, dynamic database-backed product catalog, role-based admin controls, atomic inventory deduction, Razorpay payment processing, live order tracking, and an AI-powered shopping assistant powered by Google Gemini.

**Live Demo:** [https://my-cool-store-chi.vercel.app/](https://my-cool-store-chi.vercel.app/)  
**Backend API:** [https://mycoolstore.onrender.com](https://mycoolstore.onrender.com)

---

## 🌟 Key Highlights & Features

### 1. Security & Financial Integrity
- **Server-Side Authoritative Pricing**: Order subtotals and shipping fees are calculated server-side from database records to prevent client-side price tampering exploits.
- **Concurrency & Race Condition Protection**: When placing an order, inventory stock is atomically decremented with MongoDB's `$inc` and `$gte` conditions (`Product.findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`) to prevent overselling during concurrent checkouts.
- **Cryptographic Payment Verification**: Integrated Razorpay payment gateway with HMAC-SHA256 signature verification on the server.

### 2. Role-Based Access Control (RBAC) & Admin Portal
- **Role Separation**: Secure separation between customers (`role: 'user'`) and store managers (`role: 'admin'`).
- **Protected Admin Route Guard**: Custom Express `adminMiddleware` returns `403 Forbidden` for unauthorized API calls; client-side `<AdminRoute>` guards the portal.
- **Admin Dashboard (`/admin`)**:
  - **Overview Analytics**: Real-time stats for revenue, total orders, active orders, and low-stock alerts.
  - **Catalog Management**: Add new products, adjust live stock levels, change pricing, and delete items.
  - **Order Fulfillment**: Review customer orders and advance order statuses through the state machine.

### 3. Customer Storefront & Order Tracking
- **Interactive Order Tracking**: Live 4-stage visual stepper on `/orders` (`Placed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`) with real-time updates.
- **Unified DB-Synced Cart & Wishlist**: Cart quantities and items persist across devices in MongoDB.
- **Flexible Payment Options**: Cash on Delivery (COD) and Razorpay Online Payment (UPI, Cards, NetBanking) with sandbox simulation fallback.

### 4. AI Shopping Assistant
- Integrated with **Google Gemini API** to provide conversational product recommendations, styling advice, and store guidance.

### 5. High-Performance Web Vitals
- **99% Asset Optimization**: Converted all product and banner images to modern `.webp` format, shrinking image payload from 101.6 MB down to under 1 MB.
- Native `loading="lazy"` and `decoding="async"` for fast First Contentful Paint.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router DOM, React Icons
- **Backend**: Node.js, Express.js (Modular MVC architecture)
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js
- **Payments**: Razorpay API, Node Crypto (HMAC-SHA256)
- **AI**: Google Gemini API (`@google/genai`)
- **Hosting & CI/CD**: Vercel (Frontend), Render (Backend)

---

## 📁 Project Structure

```text
MyCoolStore/
├── public/                 # Static assets & favicons
├── server/
│   ├── config/             # MongoDB connection setup
│   ├── controllers/        # Business logic (auth, product, order, chat)
│   ├── middlewares/        # JWT auth & adminMiddleware
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # RESTful API route definitions
│   ├── data/               # Default catalog & auto-seeding data
│   └── server.js           # Express app entry point
│
├── src/
│   ├── Components/
│   │   ├── Admin/          # Admin dashboard & route guard
│   │   ├── Banner/         # Responsive promo banner
│   │   ├── Cart/           # Drawer cart with DB sync
│   │   ├── ChatBot/        # Gemini AI conversational assistant
│   │   ├── Home/           # Main storefront page
│   │   ├── Login/          # Authentication & cold-start feedback
│   │   ├── Navbar/         # Header with cart, search & role switch
│   │   ├── Orders/         # Order history & live tracking stepper
│   │   ├── OrderSummary/   # Checkout modal & payment selection
│   │   ├── ProductDetails/ # Detailed view with size selection
│   │   ├── Products/       # Product grid with category filters
│   │   └── Wishlist/       # Favorite products drawer
│   │
│   ├── services/           # Frontend API client services
│   ├── config.js           # Centralized environment API config
│   ├── App.jsx             # React Router routing setup
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
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Authenticate user & issue JWT |
| GET | `/api/auth/profile` | Authenticated | Retrieve authenticated user profile |
| POST | `/api/auth/toggle-role`| Authenticated | Switch demo role between User and Admin |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products (search, filter, sort) |
| GET | `/api/products/:id` | Public | Get single product details |
| POST | `/api/products` | Admin Only | Create new catalog item |
| PUT | `/api/products/:id` | Admin Only | Update product details / stock |
| DELETE| `/api/products/:id` | Admin Only | Remove product from catalog |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders/place` | Authenticated | Place order with atomic stock check |
| GET | `/api/orders/my-orders`| Authenticated | Get current user's order history |
| POST | `/api/orders/razorpay-create` | Authenticated | Create Razorpay order ID |
| POST | `/api/orders/razorpay-verify` | Authenticated | Verify HMAC payment signature |
| GET | `/api/orders/all` | Admin Only | View all store orders |
| PUT | `/api/orders/:id/status` | Admin Only | Advance order lifecycle state |

### AI Chat Assistant (`/api/chat`)
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

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```

### 3. Setup Frontend
```bash
# In the root directory
npm install
npm run dev
```

---

## 👤 Author

**Siddharth Tiwari**
- GitHub: [@Siddharth-Tiwari-23](https://github.com/Siddharth-Tiwari-23)