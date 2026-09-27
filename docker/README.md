# GyneCare Docker Architecture

This directory outlines the containerization assets for the **GyneCare Hospital Management System**.

## Container Architecture Overview

GyneCare utilizes Docker to provide standardized, reproducible runtime environments across development, testing, staging, and production.

```
                    ┌──────────────────────────┐
                    │       User Browser       │
                    └────────────┬─────────────┘
                                 │ HTTP (Port 3000)
                                 ▼
                    ┌──────────────────────────┐
                    │  gynecare-frontend       │
                    │  (Nginx Alpine + SPA)    │
                    └────────────┬─────────────┘
                                 │ Reverse Proxy /api/*
                                 ▼
                    ┌──────────────────────────┐
                    │  gynecare-backend        │
                    │  (Node.js 20 Alpine)     │
                    └────────────┬─────────────┘
                                 │ Port 27017 (Internal)
                                 ▼
                    ┌──────────────────────────┐
                    │  gynecare-mongodb        │
                    │  (MongoDB 7.0 Community) │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   gynecare_mongodb_data  │
                    │   (Docker Named Volume)  │
                    └──────────────────────────┘
```

## Directory & File Layout

| File / Path | Component | Purpose |
|---|---|---|
| [`Dockerfile`](../Dockerfile) | Backend / Application | Production multi-layer image definition for GyneCare Express API |
| [`.dockerignore`](../.dockerignore) | Root Context | Excludes dependencies, secrets, docs, and git files from build context |
| [`server/Dockerfile`](../server/Dockerfile) | Server Service | Standalone container definition for GyneCare backend server |
| [`client/Dockerfile`](../client/Dockerfile) | Client Service | Multi-stage build (Node build -> Nginx static serving) |
| [`client/nginx.conf`](../client/nginx.conf) | Client Nginx Config | Nginx reverse-proxy configuration for Single Page Application routing |
| [`compose.yaml`](../compose.yaml) | Multi-Container Compose | Docker Compose orchestrator for frontend, backend, database, volume, and network |

## Quick Commands

### Standalone Backend Container (Assignment 4)
```bash
# Build backend image
docker build -t gynecare-app:v1 .

# Run container
docker run -d -p 5000:5000 --name gynecare-container gynecare-app:v1

# Test health check
curl http://localhost:5000/api/health
```

### Multi-Container Stack (Assignment 5)
```bash
# Start all services in detached mode
docker compose up -d

# Verify running services
docker compose ps

# Check logs
docker compose logs -f

# Stop services
docker compose down
```

For complete technical details, refer to:
- [Assignment 4 Documentation](../docs/assignment-4/assignment-4-documentation.md)
- [Assignment 5 Documentation](../docs/assignment-5/assignment-5-documentation.md)
