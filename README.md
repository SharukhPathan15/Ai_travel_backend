# ⚙️ IntelliTrip — Backend

> REST API for IntelliTrip — handles authentication, trip management, and AI itinerary generation.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Server & routing |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Anthropic SDK | AI itinerary generation |

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Anthropic API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/intellitrip-backend.git
cd intellitrip-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intellitrip
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=development
```

### Running the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000).

---

## Project Structure

```
intellitrip-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # register, login, getMe
│   └── tripController.js      # CRUD + AI generation
├── middleware/
│   ├── auth.js                # JWT verification middleware
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # User schema
│   └── Trip.js                # Trip schema (itinerary, budget, hotels)
├── routes/
│   ├── auth.js                # /api/auth routes
│   └── trips.js               # /api/trips routes
├── utils/
│   └── generateItinerary.js   # Anthropic AI prompt + parser
├── .env                       # Environment variables (not committed)
├── .env.example               # Example env template
├── server.js                  # Entry point
└── package.json
```

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

### Auth Routes `/api/auth`

#### Register
```http
POST /api/auth/register
```
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "data": { "_id": "...", "name": "Arjun Sharma", "email": "arjun@example.com" }
}
```

---

#### Login
```http
POST /api/auth/login
```
```json
{
  "email": "arjun@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGci..."
}
```

---

#### Get Current User 🔒
```http
GET /api/auth/me
```
**Response:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Arjun Sharma", "email": "arjun@example.com" }
}
```

---

### Trip Routes `/api/trips` 🔒

All trip routes are protected and scoped to the authenticated user.

#### Get All Trips
```http
GET /api/trips
```
**Response:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "destination": "Kyoto", "days": 5, ... } ]
}
```

---

#### Get Single Trip
```http
GET /api/trips/:id
```

---

#### Create Trip
```http
POST /api/trips
```
```json
{
  "destination": "Kyoto, Japan",
  "days": 5,
  "budgetType": "Medium",
  "interests": ["Culture & History", "Food & Dining"]
}
```

---

#### Delete Trip
```http
DELETE /api/trips/:id
```
**Response:**
```json
{ "success": true, "data": {} }
```

---

#### Generate AI Itinerary
```http
POST /api/trips/:id/generate
```

Calls the Anthropic API and populates the trip with:
- `itinerary[]` — day-by-day activity plans
- `budgetEstimate` — cost breakdown (flights, accommodation, food, activities)
- `hotels[]` — recommended accommodations with ratings

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "destination": "Kyoto, Japan",
    "itinerary": [
      {
        "day": 1,
        "activities": [
          { "title": "Visit Fushimi Inari Shrine", "time": "Morning" },
          { "title": "Explore Gion District", "time": "Afternoon" },
          { "title": "Kaiseki dinner in Pontocho", "time": "Evening" }
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
}
```

---

## Data Models

### User
```js
{
  name:      String (required),
  email:     String (required, unique),
  password:  String (required, hashed),
  createdAt: Date
}
```

### Trip
```js
{
  user:       ObjectId (ref: User),
  destination: String (required),
  days:        Number (required),
  budgetType:  String (enum: Low | Medium | High),
  interests:   [String],
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

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Trip not found"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (resource belongs to another user) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Scripts

```bash
npm run dev    # Start with nodemon (auto-restart on changes)
npm start      # Start production server
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a Pull Request

---

## License

MIT © IntelliTrip
