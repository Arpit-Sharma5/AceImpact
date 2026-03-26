# 🏌️ AceImpact – Golf Charity Subscription Platform

A modern full-stack SaaS application that combines golf, charity, and rewards. Users subscribe, submit golf scores, enter monthly draws, and support charities — all through a stunning dark-themed interface.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer |

## 📁 Project Structure

```
AceImpact/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Shared components (Navbar, ProtectedRoute, etc.)
│       ├── context/         # AuthContext for global auth state
│       ├── pages/           # All page components
│       ├── services/        # API service (Axios instance)
│       ├── App.jsx          # Main app with routing
│       └── index.css        # Global styles + design system
├── server/                  # Express backend
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers (7 controllers)
│   ├── middleware/          # JWT auth + admin middleware
│   ├── models/              # Mongoose schemas (6 models)
│   ├── routes/              # API route definitions (7 route files)
│   ├── uploads/             # Winner proof uploads
│   ├── seed.js              # Database seeder
│   └── server.js            # Entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally or [MongoDB Atlas](https://www.mongodb.com/atlas) URI

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aceimpact
JWT_SECRET=your_secret_key_here
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **Admin**: `admin@aceimpact.com` / `admin123`
- **User**: `john@example.com` / `user123`
- 6 sample charities

### 4. Run Development Servers

```bash
# Terminal 1 – Backend
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## ✨ Core Features

### 🔐 Authentication
- JWT-based signup/login/logout
- Protected routes (frontend + backend)
- Role-based access (user/admin)

### 💳 Subscription System
- Monthly ($9.99) / Yearly ($99.99) plans
- Mock Stripe payment simulation
- Subscription status tracking

### ⛳ Score Management
- Add golf scores (range 1–45)
- Maximum 5 scores per user
- Auto-removes oldest when adding 6th
- Displayed newest first

### 🎯 Draw & Reward System
- Monthly draw with 5 winning numbers
- Two modes: Random & Algorithm (frequency-based)
- Prize distribution: 5 match = 40%, 4 match = 35%, 3 match = 25%
- Jackpot rollover when no 5-match winner

### 💖 Charity System
- Select charity at signup or later
- Minimum 10% contribution (adjustable)
- Charity listing & detail pages

### 🏆 Winner System
- Auto-matching after draw publish
- Proof upload (images/PDF)
- Admin approve/reject workflow
- Payment status tracking

### 📊 Admin Dashboard
- User management (promote/demote/delete)
- Score editing
- Subscription management
- Run & publish draws
- Charity CRUD
- Winner verification & payment
- Analytics overview

## 🎨 UI Design

- **Dark theme** with gradient mesh backgrounds
- **Glassmorphism** cards with blur effects
- **Smooth animations** (fadeInUp, hover effects)
- **Responsive** mobile-first design
- **Inter** font from Google Fonts

## 🚢 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend → Render / Railway
- Set up a Web Service with `node server.js`
- Add environment variables (PORT, MONGODB_URI, JWT_SECRET)

### Database → MongoDB Atlas
- Create a free cluster at mongodb.com/atlas
- Update MONGODB_URI in server/.env

## 📝 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get profile |
| GET | /api/scores/my | Yes | My scores |
| POST | /api/scores | Yes | Add score |
| GET | /api/subscriptions/my | Yes | My subscription |
| POST | /api/subscriptions | Yes | Subscribe |
| GET | /api/charities | No | List charities |
| GET | /api/draws | Yes | List draws |
| POST | /api/draws/run | Admin | Run draw |
| PUT | /api/draws/:id/publish | Admin | Publish draw |
| GET | /api/winners/my | Yes | My winnings |
| POST | /api/winners/:id/proof | Yes | Upload proof |
