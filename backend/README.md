# Marhba Backend API

Express MVC backend with PostgreSQL, Sequelize, and JWT authentication with Refresh Tokens.

## 🚀 Environment Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marhba
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 🐳 Running with Docker

### Option 1: Docker Compose (Backend + PostgreSQL Database) - **Recommended**

Run the following command from the root directory:

```bash
docker compose up --build
```

Or to run in detached (background) mode:

```bash
docker compose up -d --build
```

To stop containers:

```bash
docker compose down
```

### Option 2: Standalone Docker Image

Build the docker container:

```bash
cd backend
docker build -t marhba-backend .
```

Run the container:

```bash
docker run -p 3000:3000 --env-file .env marhba-backend
```

---

## 💻 Local Development (Without Docker)

Make sure PostgreSQL is running locally on port 5432, then execute:

```bash
cd backend
npm install
npm run dev
```

---

## 📡 API Endpoints & Interactive Documentation

### 📚 Interactive API Documentation (Scalar UI)
When the server is running, open your browser and navigate to:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)** (or `/openapi.json` for raw OpenAPI 3.0 spec).

---

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Body / Headers |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No | `{ "fullName": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Login user | No | `{ "email": "...", "password": "..." }` |
| `POST` | `/api/auth/refresh-token` | Refresh Access Token | No | `{ "refreshToken": "..." }` |
| `POST` | `/api/auth/logout` | Revoke Refresh Token | No | `{ "refreshToken": "..." }` |
| `GET` | `/api/auth/me` | Get user profile | Yes | Header: `Authorization: Bearer <accessToken>` |
