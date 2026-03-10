<div align="center">

# ⚙️ IntelliTrip — Backend

**The engine behind AI-powered travel planning.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-black?style=for-the-badge&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*RESTful API powering authentication, trip management, and AI itinerary generation via Anthropic Claude.*

</div>

---

## 📌 Project Overview

IntelliTrip's backend is a RESTful API built with Node.js and Express. It handles user authentication, trip CRUD operations, and AI itinerary generation. Each user's data is fully isolated — no user can access or modify another user's trips. The AI layer uses Anthropic Claude to generate structured day-by-day itineraries, budget estimates, and hotel recommendations based on user input.

---

## 🛠 Tech Stack & Justification

| Technology | Purpose | Why |
|---|---|---|
| **Node.js + Express** | Server & routing | Lightweight, fast, and well-suited for REST APIs |
| **MongoDB + Mongoose** | Database & ODM | Flexible schema ideal for variable itinerary structures |
| **JSON Web Tokens** | Authentication | Stateless auth — no session store needed |
| **bcryptjs** | Password hashing | Industry-standard, easy to use, no native dependencies |
| **Anthropic SDK** | AI generation | Claude produces well-structured, reliable JSON output |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/intellitrip-backend.git
cd intellitrip-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your values (see below)

# 4. Start development server
npm run dev
```

Server runs at [http://localhost:5000](http://localhost:5000)

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intellitrip
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=development
```

> ⚠️ Never commit `.env` to version control. Use `.env.example` as a safe template.

### Deployed API

> 🔗 **Base URL:** [https://api.intellitrip.onrender.com/api](https://api.intellitrip.onrender.com/api)

---

## 🏗 High-Level Architecture

```
Client Request
      │
      ▼
  Express Router
      │
      ├── Auth Middleware (verifies JWT, attaches user to req)
      │
      ▼
  Controller (authController / tripController)
      │
      ├── Mongoose Model (User / Trip)
      │       └── MongoDB Atlas
      │
      └── AI Utility (generateItinerary.js)
              └── Anthropic Claude API
```

- **Routes** define endpoints and apply middleware
- **Controllers** handle business logic and call models or the AI utility
- **Models** define schema and data validation
- **Middleware** handles auth verification and global error formatting
- **Utils** contain the AI prompt builder and response parser — isolated for easy testing and swapping

---

## 🔐 Authentication & Authorization

**Registration & Login:**
- Passwords are hashed with `bcryptjs` (salt rounds: 10) before storage — plaintext passwords never touch the database
- On successful login or register, a signed JWT is returned with a configurable expiry (`JWT_EXPIRE`)

**Route Protection:**
- A `protect` middleware verifies the JWT on every protected route
- It decodes the token, fetches the user from MongoDB, and attaches them to `req.user`
- If the token is missing, expired, or invalid — the request is rejected with `401 Unauthorized`

**Data Isolation:**
- Every trip query is filtered by `user: req.user._id`
- Before any update or delete, the trip's `user` field is compared against `req.user._id`
- A mismatch returns `403 Forbidden` — users cannot access or modify other users' data under any circumstance

---

## 🤖 AI Agent Design & Purpose

The AI agent is powered by **Anthropic Claude**. When `POST /api/trips/:id/generate` is called:

1. The trip is fetched from MongoDB (destination, days, budgetType, interests)
2. A structured prompt is constructed in `utils/generateItinerary.js`
3. Claude is instructed to respond in strict JSON format with three keys: `itinerary`, `budgetEstimate`, `hotels`
4. The response is parsed and saved back to the trip document in MongoDB
5. The updated trip is returned to the frontend

**Prompt Design Principles:**
- The prompt explicitly defines the expected JSON schema to prevent hallucinated formats
- Budget type and interests are injected to personalize the output
- A fallback error is returned if Claude's response cannot be parsed as valid JSON

**Example AI Output Structure:**
```json
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        { "title": "Visit Fushimi Inari Shrine", "time": "Morning" },
        { "title": "Explore Nishiki Market", "time": "Afternoon" },
        { "title": "Gion District walk", "time": "Evening" }
      ]
    }
  ],
  "budgetEstimate": {
    "flights": 45000,
    "accommodation": 20000,
    "food": 8000,
    "activities": 5000,
    "total": 78000
  },
  "hotels": [
    { "name": "Dormy Inn Kyoto", "type": "Mid-range", "rating": 4.2 }
  ]
}
```

---

## ✨ Creative Feature — Per-Day Regeneration

Beyond generating the full itinerary, the API is designed to support **regenerating a single day** with optional custom preferences from the user (e.g. *"more outdoor activities"*, *"focus on food"*).

**Why this was built:** Full regeneration is wasteful if a user is happy with 6 out of 7 days. Targeted day regeneration respects the user's existing plan while giving them granular control — a much better experience than starting over. It also demonstrates a more sophisticated use of the AI agent where context (existing days) can be passed to avoid duplication.

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Auth Header (protected routes 🔒)
```
Authorization: Bearer <token>
```

---

### 🔑 Auth `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Sign in, receive JWT |
| GET | `/me` | 🔒 Protected | Get current user |

---

### 🗺️ Trips `/api/trips` 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all trips for current user |
| GET | `/:id` | Get single trip |
| POST | `/` | Create new trip |
| DELETE | `/:id` | Delete trip |
| POST | `/:id/generate` | Generate AI itinerary |

---

## 🗄️ Data Models

### User
```js
{
  name:      String  // required
  email:     String  // required, unique
  password:  String  // required, bcrypt hashed
  createdAt: Date
}
```

### Trip
```js
{
  user:        ObjectId   // ref: User — enforces ownership
  destination: String     // required
  days:        Number     // required
  budgetType:  String     // enum: "Low" | "Medium" | "High"
  interests:   [String]
  itinerary: [{
    day:        Number,
    activities: [{ title: String, time: String }]
  }],
  budgetEstimate: {
    flights:       Number,
    accommodation: Number,
    food:          Number,
    activities:    Number,
    total:         Number
  },
  hotels: [{
    name:   String,
    type:   String,
    rating: Number
  }],
  createdAt: Date
}
```

---

## 🚨 Error Handling

All errors follow a consistent response format:

```json
{
  "success": false,
  "message": "Trip not found"
}
```

| Status | Meaning |
|---|---|
| `400` | Validation error or bad request |
| `401` | Missing or invalid token |
| `403` | Forbidden — resource belongs to another user |
| `404` | Resource not found |
| `500` | Internal server error |

A global error handler middleware catches all unhandled errors and formats them consistently — controllers never send raw error objects to the client.

---

## 🎯 Key Design Decisions & Trade-offs

| Decision | Reasoning | Trade-off |
|---|---|---|
| MongoDB over SQL | Itinerary is a nested, variable-length structure — document model fits naturally | Less suited for complex relational queries |
| JWT over sessions | Stateless — scales horizontally without a session store | Token revocation requires expiry or a blocklist |
| AI response in strict JSON | Reliable parsing, no regex needed | Requires careful prompt engineering |
| Utility function for AI | Isolates prompt logic — easy to swap models or update prompts | Adds an extra layer to trace |
| Global error middleware | Consistent error format across all routes | Requires all errors to be passed via `next(err)` |

---

## ⚠️ Known Limitations

- No rate limiting on the AI generation endpoint — could be abused in production
- JWT revocation is not implemented — logging out only clears the client-side token
- Day regeneration endpoint is scaffolded but uses a mock response — production would call Claude with day-specific context
- No input sanitization library — relies on Mongoose validation only

---

## 📜 Scripts

```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Production server
```

---

<div align="center">

MIT © [IntelliTrip](https://github.com/your-username/intellitrip) · Built with ❤️ and ☕

</div>
