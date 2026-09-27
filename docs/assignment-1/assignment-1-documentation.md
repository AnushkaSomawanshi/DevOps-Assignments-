# Assignment 1 — GyneCare MERN Stack Base Application & System Architecture

## 1. Assignment Title
**GyneCare Hospital Management System: Baseline Architecture, Implementation, and Environment Setup**

## 2. Aim
To establish, document, and verify the baseline full-stack MERN (MongoDB, Express, React, Node.js) web application for GyneCare Hospital Management System, providing a modular, scalable foundation for subsequent DevOps practices including cloud hosting, Infrastructure as Code, containerization, and multi-container orchestration.

## 3. Objectives
- Implement and document the core architecture of the GyneCare hospital management platform.
- Configure a modern Single Page Application (SPA) frontend utilizing React 19, TypeScript, and Vite.
- Implement a robust RESTful backend API service using Node.js and Express.
- Design data models and seed routines for hospital entities using MongoDB and Mongoose.
- Establish environment configuration and local execution procedures.
- Validate health check and business logic API endpoints.

## 4. Learning Outcomes
- Understanding the three-tier web application architecture (Presentation, Application, and Data Tier).
- Configuring modular routing, state management, and component architecture in modern React.
- Building REST APIs with Express.js including health checks, error middleware, and database connectivity.
- Managing NoSQL database schemas and lifecycle events using Mongoose.
- Establishing standard project directory structures and reproducible developer environments.

## 5. System Overview & Architecture
GyneCare is a comprehensive women's healthcare and hospital management application designed to facilitate patient appointments, doctor consultations, specialized health packages, medical records, and healthcare analytics.

### Architectural Tiers

```
┌─────────────────────────────────────────────────────────────┐
│                  Presentation Tier (Client)                 │
│  React 19 • TypeScript • Vite • Tailwind CSS • TanStack     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Tier (Server)                 │
│       Node.js 20 • Express.js • Middleware • Controllers    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose Driver (TCP)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Tier (Database)                   │
│             MongoDB 7.0 • Collections & Schemas             │
└─────────────────────────────────────────────────────────────┘
```

## 6. Technology Stack

| Layer | Technologies / Frameworks | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS | High-performance, responsive Single Page Application |
| **Backend** | Node.js (>=18.0.0), Express 4.21.2, CORS, Dotenv | Asynchronous RESTful API server |
| **Database** | MongoDB 7.0, Mongoose 8.9.5 | Document database for healthcare records |
| **Tooling** | Biome, PostCSS, Autoprefixer | Code formatting, linting, and CSS processing |

## 7. Project Structure

```text
BOT-MERN-Gynecare-Hospital-Management-System-/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components & dashboards
│   │   ├── hooks/              # Custom React hooks (useDoctors, useAppointments)
│   │   ├── lib/                # API client helper & utilities
│   │   ├── pages/              # Routed page components (Home, BookAppointment, etc.)
│   │   ├── App.tsx             # Application root
│   │   └── main.tsx            # Entry point & QueryClient provider
│   ├── package.json            # Frontend dependencies and scripts
│   └── vite.config.js          # Vite build and proxy configuration
├── server/                     # Backend API Service
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Route controllers (appointment, doctor, hospital, etc.)
│   ├── data/                   # Seed data (seedData.js)
│   ├── models/                 # Mongoose schemas (Doctor, User, Hospital, Appointment)
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Seeding utility (seed.js)
│   ├── package.json            # Backend dependencies and scripts
│   └── server.js               # Express application entry point
├── .env.example                # Safe environment variable template
└── package.json                # Workspace root orchestrator
```

## 8. Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service root status and documentation links |
| `GET` | `/api/health` | Service health status and uptime |
| `GET` | `/api/doctors` | List of specialized healthcare practitioners |
| `GET` | `/api/hospitals` | Hospital branches and location details |
| `GET` | `/api/packages` | Preventive and specialized health packages |
| `GET` | `/api/blogs` | Health education and medical articles |
| `POST`| `/api/auth/register` | Patient and user registration |
| `POST`| `/api/auth/login` | User authentication |
| `POST`| `/api/appointments` | Appointment scheduling |

## 9. Local Development & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB Community Server (v6.0 or v7.0)

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
# Server listens on http://localhost:5000
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Client is accessible at http://localhost:5173
```

## 10. Verification & Testing

### Health Check Verification
```bash
curl http://localhost:5000/api/health
```
**Expected Output:**
```json
{
  "ok": true,
  "status": "healthy",
  "service": "GyneCare Hospital Management API",
  "uptime": 12.34,
  "timestamp": "2026-09-27T15:25:24.878Z"
}
```

### Doctor Catalog Verification
```bash
curl http://localhost:5000/api/doctors
```
**Expected Output:** Returns JSON array of seeded doctors with credentials, specialties, and available consultation days.

## 11. Conclusion
Assignment 1 establishes the verified full-stack GyneCare application baseline. The modular separation between frontend (`client/`), backend (`server/`), and database persistence enables straightforward containerization, cloud deployment, and infrastructure orchestration in subsequent assignments.
