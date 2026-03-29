# 🔐 Auth & Task Management API

A secure, production-ready REST API with JWT authentication, role-based access control, and full-stack task management — built as part of the PrimeTrade Backend Internship Assignment.

![Backend Design](./design.png)

---

## Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js                        |
| Framework        | Express.js                     |
| Database         | PostgreSQL                     |
| ORM              | Prisma                         |
| Authentication   | JWT via httpOnly Cookies       |
| Validation       | Zod                            |
| Password Hashing | bcrypt                         |
| Frontend         | React.js + Vite + Tailwind CSS |
| HTTP Client      | Axios                          |
| Routing          | React Router DOM               |

---

## Features

### Backend

- JWT authentication stored in **httpOnly cookies** — inaccessible to JavaScript, preventing XSS attacks
- **Role-based access control** — `user` and `admin` roles with enforced route-level and data-level restrictions
- Full **CRUD on Tasks** with ownership enforcement — users can only access their own data
- **Admin routes** — view all users and all tasks system-wide
- **API versioning** via `/api/v1/` prefix for forward compatibility
- **Zod validation** on all inputs — bad requests are rejected before reaching business logic
- **Global error handler** — consistent JSON error responses across the entire app, no raw errors exposed
- Clean **layered architecture** — routes → controllers → services, each with a single responsibility

### Frontend

- React + Vite with Tailwind CSS
- Protected dashboard — unauthenticated users are redirected to login
- Full task CRUD from the UI — create, edit, delete with live state updates
- **Admin panel** — toggle between own tasks, all tasks, and all users table
- Task status stats — live count of pending, in-progress and completed tasks
- Error and success feedback on all API interactions

---

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Prisma client instance
│   │   ├── middlewares/
│   │   │   ├── auth.js            # JWT cookie verification → req.user
│   │   │   ├── requireAdmin.js    # Role guard for admin routes
│   │   │   └── errorHandler.js    # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js    # Business logic: register, login, getUserById
│   │   │   └── task.service.js    # Business logic: CRUD + ownership checks
│   │   └── validators/
│   │       ├── auth.validator.js  # Zod schemas for register & login
│   │       └── task.validator.js  # Zod schemas for create & update task
│   ├── prisma/
│   │   └── schema.prisma
│   ├── app.js
│   └── server.js
│
├── client/                        # React + Vite frontend
├── postman_collection.json
├── design.png
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL running locally

### Installation

```bash
# Clone the repository
git clone https://github.com/thecreatorzx/intern-assignment.git
cd intern-assignment

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

```bash
cd server
cp .env.example .env
# Fill in your values
```

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/intern_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
cd server
npx prisma migrate dev --name init
npx prisma studio   # Optional: visual DB viewer at localhost:5555
```

### Run the App

```bash
# From project root (runs both server and client)
npm run dev
```

Server → `http://localhost:5000`
Client → `http://localhost:5173`

### Proxy Configuration (Development)

The frontend uses Vite's built-in proxy to forward API requests to the backend:

```js
// client/vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

This means `axios.get('/api/v1/tasks')` in the frontend is transparently
forwarded to `http://localhost:5000/api/v1/tasks` — keeping cookies on the
same origin during development without any additional configuration.

- **Cross-origin cookie persistence** — httpOnly cookies set by the backend were
  not being sent on subsequent requests because the frontend (port 5173) and
  backend (port 5000) ran on different ports, which browsers treat as separate
  origins. Solved by routing all API calls through Vite's proxy, making every
  request appear same-origin to the browser.

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

### Auth

| Method | Endpoint         | Description                   | Auth |
| ------ | ---------------- | ----------------------------- | ---- |
| POST   | `/auth/register` | Register user, set JWT cookie | No   |
| POST   | `/auth/login`    | Login, set JWT cookie         | No   |
| POST   | `/auth/logout`   | Clear JWT cookie              | Yes  |
| GET    | `/auth/me`       | Get current user              | Yes  |

### Tasks

| Method | Endpoint     | Description              | Auth |
| ------ | ------------ | ------------------------ | ---- |
| GET    | `/tasks`     | Get own tasks            | Yes  |
| GET    | `/tasks/:id` | Get task by ID           | Yes  |
| POST   | `/tasks`     | Create task              | Yes  |
| PUT    | `/tasks/:id` | Update task (owner only) | Yes  |
| DELETE | `/tasks/:id` | Delete task (owner only) | Yes  |

### Admin

| Method | Endpoint       | Description                   | Auth  |
| ------ | -------------- | ----------------------------- | ----- |
| GET    | `/admin/users` | Get all users                 | Admin |
| GET    | `/admin/tasks` | Get all tasks with owner info | Admin |

### Response Format

Every response follows a consistent shape:

```json
// Success
{ "success": true, "message": "Task created", "data": { ... } }

// Error
{ "success": false, "message": "Invalid credentials" }
```

---

## Security Practices

- **httpOnly cookies** — JWT never accessible via JavaScript, preventing XSS
- **bcrypt** password hashing with 10 salt rounds
- **Ownership enforcement** — task mutations verify `task.userId === req.user.id` before any DB operation
- **CORS** locked to frontend origin with `credentials: true`
- **Zod validation** — all inputs sanitized before reaching service layer
- **Consistent auth error messages** — login returns `Invalid credentials` regardless of whether email or password is wrong, preventing user enumeration
- **No raw DB errors** — global error handler intercepts all exceptions and returns clean JSON
- **Role guard middleware** — `requireAdmin` always chained after `auth`, never standalone

---

## API Testing (Postman)

A complete Postman collection is included with descriptions, example request bodies and saved responses for every endpoint.

1. Open Postman → click **Import**
2. Select `postman_collection.json` from the project root
3. Hit **Register** or **Login** first — JWT cookie is stored automatically
4. All subsequent requests send the cookie without any manual setup

---

## Scalability Notes

**Microservices** — Auth and Task domains are fully isolated into independent service layers and route modules. These can be extracted into standalone microservices behind an API gateway (Nginx or Kong) with zero business logic changes.

**Caching** — `GET /tasks` responses can be cached per user in **Redis** with targeted invalidation on create, update or delete — significantly reducing read load on PostgreSQL.

**Load Balancing** — Stateless JWT via cookies (no server-side sessions) means any number of Node.js instances can run behind a load balancer without shared session concerns. Horizontal scaling is plug-and-play.

**Database Scaling** — Prisma supports read replicas. As read traffic scales, GET queries can be routed to a replica while writes go to the primary, splitting load cleanly across the database tier.

**Future Modules** — The folder structure is designed for extension. Adding a new domain (e.g. `products`) requires only a new route, controller, service and validator file — no changes to existing code.

---

## Author

**Mohd Saad**

- GitHub: [@thecreatorzx](https://github.com/thecreatorzx)
- LinkedIn: [webdevmsaad](https://linkedin.com/in/webdevmsaad)
- Portfolio: [Portfolio](https://itsmyportfolioapp.netlify.app)
