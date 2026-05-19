# GigFlow — Smart Leads Dashboard

A production-quality MERN stack application for managing sales leads with role-based access control, filtering, pagination, and CSV export.

## Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Role-Based Access Control** — Admin (full access) and Sales (no delete access)
- **Leads CRUD** — Full create, read, update, delete operations
- **Advanced Filtering** — Combined filter by status, source, and text search
- **Server-Side Pagination** — 10 records per page with pagination metadata
- **CSV Export** — Export filtered leads to downloadable CSV files
- **Debounced Search** — Optimized search with 500ms debounce
- **Responsive UI** — Mobile-friendly dashboard with collapsible sidebar
- **Loading & Empty States** — Proper UX for all data states

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod schemas |
| State | Zustand (auth), TanStack Query (server) |
| Forms | React Hook Form + Zod resolver |
| Icons | Lucide React |
| Styling | TailwindCSS with clsx + tailwind-merge |
| Containerization | Docker + docker-compose |

## Project Structure

```
Gigflow/
├── backend/
│   └── src/
│       ├── config/          # Environment & database config
│       ├── controllers/     # Route handlers
│       ├── interfaces/      # TypeScript interfaces
│       ├── middleware/       # Auth, validation, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routes
│       ├── services/        # Business logic layer
│       ├── types/           # Zod schemas & inferred types
│       └── utils/           # Helpers (ApiError, ApiResponse, CSV)
├── frontend/
│   └── src/
│       ├── api/             # Axios instances & API functions
│       ├── components/
│       │   ├── auth/        # Login & Register forms
│       │   ├── layout/      # Sidebar, Navbar, DashboardLayout
│       │   ├── leads/       # LeadTable, LeadForm, LeadFilters
│       │   └── ui/          # Reusable UI primitives
│       ├── hooks/           # Custom hooks (useDebounce)
│       ├── pages/           # Page-level components
│       ├── routes/          # Protected routes & app routing
│       ├── schemas/         # Zod validation schemas
│       ├── store/           # Zustand auth store
│       ├── types/           # TypeScript type definitions
│       └── utils/           # cn() utility
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB 7+ (or Docker)

### Local Development

#### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

#### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:5000`.

### Docker (Production)

```bash
# From project root
cp .env.example .env
# Edit JWT_SECRET in .env

docker compose up -d
```

- Frontend: http://localhost
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gigflow` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `NODE_ENV` | Environment | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## API Routes

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Leads

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| GET | `/api/leads` | List leads (paginated) | Yes | Admin / Sales |
| GET | `/api/leads/export` | Export leads as CSV | Yes | Admin / Sales |
| GET | `/api/leads/:id` | Get single lead | Yes | Admin / Sales |
| POST | `/api/leads` | Create lead | Yes | Admin / Sales |
| PUT | `/api/leads/:id` | Update lead | Yes | Admin / Sales |
| DELETE | `/api/leads/:id` | Delete lead | Yes | Admin only |

### Query Parameters (GET /api/leads)

| Parameter | Type | Example |
|---|---|---|
| `status` | string | `Qualified` |
| `source` | string | `Instagram` |
| `search` | string | `Rahul` |
| `page` | number | `1` |
| `limit` | number | `10` |
| `sort` | `latest` / `oldest` | `latest` |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| name | String | Required, trimmed |
| email | String | Required, unique, lowercase |
| password | String | Required, min 6 chars, hashed |
| role | Enum | `Admin` / `Sales` (default: Sales) |
| timestamps | Date | createdAt, updatedAt |

### Lead

| Field | Type | Notes |
|---|---|---|
| name | String | Required, trimmed |
| email | String | Required, lowercase |
| status | Enum | `New` / `Contacted` / `Qualified` / `Lost` |
| source | Enum | `Website` / `Instagram` / `Referral` |
| createdBy | ObjectId | Reference to User |
| timestamps | Date | createdAt, updatedAt |

## Deployment

### Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

The frontend build outputs static files to `frontend/dist/` which can be served via Nginx or any static server. The backend compiles to `backend/dist/`.

### Docker Deployment

```bash
docker compose up -d --build
```

## License

MIT
