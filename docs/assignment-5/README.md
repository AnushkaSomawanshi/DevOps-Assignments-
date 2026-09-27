# Assignment 5 — Multi-Container Application with Docker Compose

## Overview
Assignment 5 orchestrates the full **GyneCare Hospital Management System** across multiple isolated containers using modern Docker Compose (`compose.yaml`).

## Aim & Objective
- Define and coordinate a genuine multi-tier microservice architecture:
  - **Frontend Service**: React 19 Single Page Application compiled and served via Nginx.
  - **Backend Service**: Express.js REST API providing healthcare endpoints and seeding logic.
  - **Database Service**: MongoDB 7.0 Community edition with persistent block storage.
- Implement an isolated bridge network (`gynecare-network`) for internal DNS service discovery.
- Implement named persistent volume (`gynecare_mongodb_data`) to safeguard patient records across container lifecycles.
- Configure dependency synchronization using healthchecks (`depends_on: condition: service_healthy`).
- Verify complete operational lifecycle: `config` -> `build` -> `up -d` -> `ps` -> `logs` -> `down`.

## Technologies Used
- **Orchestration**: Docker Compose (v5.5.0, `compose.yaml`)
- **Frontend**: Nginx Alpine, React 19, Vite
- **Backend**: Node.js 20 Alpine, Express 4.21.2, Mongoose
- **Database**: MongoDB 7.0
- **Storage & Network**: Docker Named Volumes, Custom Bridge Network

## Important Files
- [`compose.yaml`](../../compose.yaml) — Master multi-container specification
- [`client/Dockerfile`](../../client/Dockerfile) — Multi-stage frontend Dockerfile
- [`client/nginx.conf`](../../client/nginx.conf) — Nginx SPA routing & API reverse proxy configuration
- [`server/Dockerfile`](../../server/Dockerfile) — Backend container Dockerfile
- [`.env.example`](../../.env.example) — Safe environment variable configuration template

## Quick Commands
```bash
# 1. Validate configuration
docker compose config

# 2. Build service images
docker compose build

# 3. Launch stack in background
docker compose up -d

# 4. View service status and health
docker compose ps

# 5. Access application
# Frontend Web App: http://localhost:3000
# Backend Health Check: http://localhost:5000/api/health
# Seeded Database Records: http://localhost:5000/api/doctors

# 6. Stream logs
docker compose logs -f

# 7. Stop and teardown stack (preserving data volume)
docker compose down
```

## Detailed Documentation
For the complete technical report, architecture diagrams, networking analysis, and troubleshooting guides, refer to:
- [Assignment 5 Technical Documentation](assignment-5-documentation.md)
