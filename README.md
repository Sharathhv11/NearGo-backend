# NearGo Backend

A Node.js / Express REST API powering the **NearGo** platform — a local business discovery and social-engagement application. It handles authentication, business management, media uploads, payments, analytics, and email notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| File Storage | Supabase Storage |
| Payments | Razorpay |
| Auth | JWT + Google OAuth 2.0 |
| Email | Brevo (Sendinblue) / Nodemailer |
| Rate Limiting | express-rate-limit |
| Media Handling | Multer |

---

## Project Structure

```
NearGo-backend/
├── app.js               # Express app setup, CORS, route registration
├── server.js            # HTTP server entry point
├── configure/
│   └── supabase.js      # Supabase client initialisation
├── controllers/
│   ├── Auth/            # Sign‑up, login, Google OAuth, password reset
│   ├── Business/        # Business CRUD, posts, media
│   ├── Users/           # User profile management
│   ├── Follow/          # Follow / unfollow logic
│   ├── Payment/         # Razorpay order creation & verification
│   ├── Analytics/       # Business analytics endpoints
│   └── Error/           # Global error handler
├── models/              # Mongoose schemas
├── routes/              # Express routers
├── service/             # Third-party service helpers (email, etc.)
└── utils/
    ├── uploadFiles.js   # Supabase multi-file upload helper
    ├── cleanUpCloud.js  # Supabase file deletion helper
    └── customError.js   # Custom error class
```

---

## API Routes

| Prefix | Description |
|---|---|
| `GET /health` | Server health check |
| `/api/auth` | Registration, login, Google OAuth, password reset |
| `/api/user` | User profile read / update |
| `/api/business` | Business registration, posts, media |
| `/api/follow` | Follow / unfollow, follower counts |
| `/api/payment` | Razorpay order creation & webhook |
| `/api/analytics` | Business analytics (views, engagement) |

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# Server
PORT=5000
NODE_ENV=DEV

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/NearGo

# JWT
SECRECT_CODE=your_jwt_secret
SALTROUNDS=10

# Supabase
SUPABASE=https://<project>.supabase.co
SUPABASEAPIKEY=your_supabase_api_key
SUPABASE_BUCKET=images

# CORS
FRONTEND=http://localhost:5173

# Email (Brevo)
BREVO_API_KEY=your_brevo_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Subscription
PREMIUM_DAYS=30

# Media limits
MEDIALIMIT=2
FREE_TIER_TWEET_MEDIA=5

# Business limits
BUSINESS_REG_LIMIT_FREE=1
BUSINESS_REG_LIMIT_PAID=3
BUSINESS_POST_MEDIA_LIMIT_FREE=3
BUSINESS_POST_MEDIA_LIMIT_PAID=5
BUSINESS_MEDIA_UPLOAD_LIMIT_FREE=5
BUSINESS_MEDIA_UPLOAD_LIMIT_PAID=10
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A running MongoDB Atlas cluster
- Supabase project with a storage bucket named `images`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/NearGo-backend.git
cd NearGo-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in all required values in .env

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (hot‑reload) |

---

## Author

**Sharath HV**

---

## License

ISC
