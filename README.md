# Safardrop

Safardrop is a full-stack parcel and trip booking platform.

- Frontend: React + Vite (`frontend/`)
- Backend: Spring Boot (`src/`)
- Database: MySQL (production), H2 fallback (local/dev fallback)

## Project Structure

```text
Safardrop/
├─ frontend/                  # React app
├─ src/main/java/             # Spring Boot backend
├─ src/main/resources/        # Backend config
├─ Dockerfile                 # Render deployment image
├─ pom.xml                    # Maven backend config
└─ backend.env.example        # Example backend environment variables
```

## Prerequisites

- Java 17+
- Node.js + npm
- Maven Wrapper (`mvnw`) is included

## Run Locally

### 1) Backend

```bash
./mvnw spring-boot:run
```

Backend runs on:

- `http://localhost:8081`

Health endpoint:

- `GET /` -> `SafarDrop Backend Running 🚀`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## Environment Variables

### Backend

Configured in Render (or local `backend.env`):

- `SPRING_DATASOURCE_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `APP_AUTH_TOKEN_SECRET`
- `APP_CORS_ALLOWED_ORIGINS`
- `RAZORPAY_KEY` (optional)
- `RAZORPAY_SECRET` (optional)
- `APP_PAYMENT_DEMO_MODE` (optional)

Example MySQL JDBC URL:

```text
jdbc:mysql://<HOST>:3306/<DB_NAME>?sslMode=REQUIRED&serverTimezone=UTC
```

### Frontend

Configured in Vercel (or local `frontend/.env`):

- `VITE_API_BASE_URL` (example: `https://<backend>.onrender.com/api`)
- `VITE_PAYMENT_DEMO_MODE`

## Deployment

### Frontend (Vercel)

1. Import GitHub repo in Vercel.
2. Set Root Directory to `frontend`.
3. Add frontend env variables.
4. Deploy.

`frontend/vercel.json` is included for SPA rewrites.

### Backend (Render)

1. Create a Render **Web Service** from this repo.
2. Environment: **Docker**
3. Branch: `main`
4. Add backend environment variables.
5. Deploy.

`Dockerfile` is included for backend deployment.

## Build and Test

### Backend tests

```bash
./mvnw test
```

### Frontend production build

```bash
cd frontend
npm run build
```

