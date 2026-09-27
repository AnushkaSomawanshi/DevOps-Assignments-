# Assignment 4 — Dockerize GyneCare Application

## Overview
Assignment 4 demonstrates the containerization of the **GyneCare Hospital Management System** application component using Docker, establishing an immutable, isolated, and production-ready container image.

## Aim & Objective
- Package the GyneCare Express/Node.js API application into a Docker container.
- Author an optimized `Dockerfile` leveraging Alpine Linux (`node:20-alpine`), layer caching, and non-root execution (`USER gynecareuser`).
- Configure `.dockerignore` to keep local artifacts, dependencies, and secrets out of build contexts.
- Test and verify the complete Docker command workflow and container lifecycle.
- Validate port mapping (5000:5000), application logs, and health status (`/api/health`).

## Technologies Used
- **Container Platform**: Docker Engine (v29.7.2), Docker CLI
- **Base Image**: `node:20-alpine` (Lightweight Node.js LTS)
- **Application**: GyneCare Express REST API Server
- **Security**: Non-root container user (`gynecareuser`), curl-based container health checking

## Important Files
- [`Dockerfile`](../../Dockerfile) — Root production Dockerfile for GyneCare application
- [`.dockerignore`](../../.dockerignore) — Build context exclusion definitions
- [`server/server.js`](../../server/server.js) — Application server binding to `0.0.0.0:5000` with health endpoint
- [`server/Dockerfile`](../../server/Dockerfile) — Isolated server component Dockerfile

## Main Commands
```bash
# 1. Build Docker image
docker build -t gynecare-app:v1 .

# 2. List Docker images
docker images gynecare-app:v1

# 3. Run container in detached mode with port mapping
docker run -d -p 5000:5000 --name gynecare-container gynecare-app:v1

# 4. Check running container status
docker ps --filter "name=gynecare-container"

# 5. Verify application health
curl http://localhost:5000/api/health

# 6. View container logs
docker logs gynecare-container

# 7. Stop and remove container
docker stop gynecare-container && docker rm gynecare-container
```

## Detailed Documentation
For complete architecture diagrams, Dockerfile explanations, lifecycle workflows, and troubleshooting tables, refer to:
- [Assignment 4 Technical Documentation](assignment-4-documentation.md)
