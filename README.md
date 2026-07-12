# MyCoolStore – AI-Powered Full-Stack E-Commerce Platform

MyCoolStore is a modern full-stack e-commerce platform that provides secure user authentication, shopping cart management, order processing, wishlist functionality, and an AI-powered shopping assistant built using Google's Gemini API.

**Tech Stack:** React · Node.js · Express.js · MongoDB · JWT · Tailwind CSS · Gemini AI

---

## Features

### User Features

- User Registration & Login
- JWT Authentication
- Protected Routes
- Persistent User Sessions
- Product Browsing
- Product Details
- Shopping Cart Management
- Wishlist
- Order Placement
- Order History
- Responsive User Interface

### AI Shopping Assistant

- Google Gemini AI Integration
- Natural Language Shopping Assistance
- Product Recommendations
- Shopping Guidance
- Customer Support Chatbot
- Order Related Queries

### Backend Features

- RESTful API
- Express.js Backend
- MongoDB Database
- Secure Authentication
- Modular MVC Architecture

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

### Database
- MongoDB
- Mongoose

### AI
- Google Gemini API

### Tools
- Git
- GitHub
- VS Code
- Postman
- Vercel

---

## Project Structure

```text
MyCoolStore
│
├── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── server.js
│
├── src/
│   ├── Components/
│   │   ├── Banner/
│   │   ├── Cart/
│   │   ├── ChatBot/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Navbar/
│   │   ├── Orders/
│   │   ├── ProductDetails/
│   │   ├── Products/
│   │   ├── Register/
│   │   ├── Wishlist/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── README.md
```

---

## Architecture

```text
                 React Frontend
                        │
                 REST API Requests
                        │
                Express.js Backend
                        │
        ┌───────────────┴────────────────┐
        │                                │
 JWT Authentication              Google Gemini AI
        │                                │
        └──────────── MongoDB ───────────┘
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place Order |
| GET | /api/orders | Get User Orders |

### AI Chatbot

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Ask Gemini AI |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Siddharth-Tiwari-23/MyCoolStore.git
cd MyCoolStore
```

### Install Dependencies

```bash
npm install
```

### Start Backend

```bash
cd server
npm install
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## Live Demo

Frontend: https://my-cool-store-chi.vercel.app/

---

## Future Enhancements

- Payment Gateway Integration
- Admin Dashboard
- Inventory Management
- Product Reviews & Ratings
- Email Notifications
- AI Personalized Recommendations

---

## Author

**Siddharth Tiwari**

GitHub: https://github.com/Siddharth-Tiwari-23