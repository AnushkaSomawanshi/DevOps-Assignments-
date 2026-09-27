# Assignment 4 — Dockerize the GyneCare Hospital Management Application

## 1. Assignment Title
**Containerizing the GyneCare Hospital Management Application Using Docker**

## 2. Aim
To explore Docker container architecture, core commands, and Dockerfile design, and to containerize the existing GyneCare application into a lightweight, portable, and secure Docker image that runs consistently across any target host environment.

## 3. Objectives
- Containerize the existing GyneCare Node.js/Express application component.
- Author an optimized, production-ready `Dockerfile` implementing security and caching best practices.
- Configure `.dockerignore` to eliminate unnecessary files, local dependencies, and secrets from build contexts.
- Build, tag, and verify the Docker image (`gynecare-app:v1`).
- Execute and manage container lifecycles (`run`, `ps`, `logs`, `exec`, `stop`, `start`, `restart`, `rm`, `rmi`).
- Validate container health, port mapping (Host 5000:Container 5000), and REST API endpoints (`/` and `/api/health`).

## 4. Learning Outcomes
- Understanding the architectural distinction between images (immutable blueprints) and containers (running runtime instances).
- Implementing efficient Docker layer caching through strategic ordering of `COPY` and `RUN` instructions.
- Applying container security best practices: running under non-privileged users (`USER gynecareuser`), selecting lightweight base images (`node:20-alpine`), and avoiding hardcoded secrets.
- Configuring host-to-container port translation and interface binding (`0.0.0.0`).
- Troubleshooting runtime errors, inspecting container metadata, and executing operational diagnostics.

## 5. Docker Introduction
Docker is an open-source containerization platform that packages applications together with all their runtime dependencies, system libraries, configuration files, and tools into standardized container units. Unlike traditional virtual machines (VMs) that require full guest operating system overhead and a hypervisor, Docker containers share the host operating system kernel, offering sub-second startup times, minimal memory footprint, and consistent execution across development, staging, and production environments.

## 6. Docker Architecture
The Docker architecture follows a client-server model:

```
┌─────────────────┐             ┌────────────────────────────────────────────────────────┐
│  Docker Client  │             │                      Docker Host                       │
│                 │             │                                                        │
│  • docker build │ ──REST API─>│   ┌────────────────────────────────────────────────┐   │
│  • docker run   │             │   │                 Docker Daemon                  │   │
│  • docker ps    │             │   │                    (dockerd)                   │   │
│  • docker logs  │             │   └──────┬──────────────────────┬──────────────────┘   │
└─────────────────┘                        │                      │                      │
                                           ▼                      ▼                      │
                               ┌──────────────────────┐  ┌───────────────────────────┐   │
                               │     Docker Images    │  │     Docker Containers     │   │
                               │  • node:20-alpine    │  │  • gynecare-container     │   │
                               │  • gynecare-app:v1   │  │    (Port 5000:5000)       │   │
                               └──────────────────────┘  └───────────────────────────┘   │
                                                                                         │
                                           ▲ (Pulls base images)                         │
                                           │                                             │
                                ┌─────────────────────┐                                  │
                                │   Docker Registry   │                                  │
                                │    (Docker Hub)     │                                  │
                                └─────────────────────┘                                  │
                                                                                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Docker Client (`docker`)**: The CLI tool used by engineers to issue commands.
- **Docker Daemon (`dockerd`)**: The background process managing images, containers, networks, and storage.
- **Docker Images**: Read-only, layered templates defining the application and dependencies.
- **Docker Containers**: Isolated, runnable runtime instances of Docker images.
- **Docker Registry**: Repository storage (e.g., Docker Hub) for distributing base and application images.

## 7. GyneCare Application Overview
GyneCare is a MERN-stack hospital management platform. The core application server (`server/`) is implemented with Node.js and Express.js, providing RESTful endpoints for appointment scheduling, doctor directories, patient authentication, medical blog publication, health packages, and medical analytics.

## 8. Existing Application Structure
The application repository is organized into distinct presentation and application tiers:
- `server/package.json`: Manages backend dependencies (`express`, `mongoose`, `cors`, `dotenv`, etc.).
- `server/server.js`: Express server initializing API routes, CORS middleware, and port listeners.
- `server/config/db.js`: MongoDB connection module.
- `server/routes/`: Route handlers for health, doctors, appointments, and authentication.
- `client/`: React 19 / Vite frontend application.

## 9. Dockerization Strategy
1. **Target Component**: The core GyneCare Express API server (`server/`) is selected for primary containerization in Assignment 4.
2. **Base Image Selection**: `node:20-alpine` is chosen for its lightweight footprint (~140MB vs ~1GB for full Debian-based Node) and low vulnerability surface.
3. **Layer Caching**: `server/package*.json` is copied and installed prior to copying source code, ensuring npm package downloads are cached unless dependencies change.
4. **Least Privilege Principle**: A non-root group (`gynecaregroup`) and user (`gynecareuser`) are created and assigned application directory ownership.
5. **Resilient Startup**: The server binds to `0.0.0.0` and implements connection retries to ensure `/api/health` responds even when MongoDB is deferred.
6. **Container Health Checking**: Native Docker `HEALTHCHECK` periodically probes `GET /api/health` via `curl`.

## 10. Dockerfile
The production Dockerfile is placed at the project root:

```dockerfile
# Base image: Official Node.js LTS (Lightweight Alpine Linux)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Install system dependencies (curl for healthchecks)
RUN apk add --no-cache curl

# Create non-root group and user for security best practices
RUN addgroup -S gynecaregroup && adduser -S gynecareuser -G gynecaregroup

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy dependency manifests first to leverage Docker layer caching
COPY server/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy backend application source code
COPY server/ ./

# Change ownership of application files to non-root user
RUN chown -R gynecareuser:gynecaregroup /app

# Switch to non-privileged user
USER gynecareuser

# Expose the application port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the GyneCare Node.js application
CMD ["node", "server.js"]
```

## 11. Dockerfile Explanation
- `FROM node:20-alpine`: Specifies Node.js v20 on Alpine Linux 3.20 as the immutable base layer.
- `WORKDIR /app`: Defines `/app` as the absolute execution path for all subsequent instructions.
- `RUN apk add --no-cache curl`: Adds `curl` for container health monitoring without keeping package cache.
- `RUN addgroup -S gynecaregroup && adduser -S gynecareuser -G gynecaregroup`: Creates a system-level non-root user.
- `ENV NODE_ENV=production PORT=5000`: Sets production mode and default network port.
- `COPY server/package*.json ./`: Copies package descriptors into `/app`.
- `RUN npm install --omit=dev --no-audit --no-fund`: Installs production packages cleanly without development tooling.
- `COPY server/ ./`: Copies backend code (`server.js`, `controllers`, `models`, `routes`, `utils`).
- `RUN chown -R gynecareuser:gynecaregroup /app`: Grants file ownership to the non-root user.
- `USER gynecareuser`: Drops root capabilities before runtime execution.
- `EXPOSE 5000`: Documents that container processes listen on TCP port 5000.
- `HEALTHCHECK`: Periodically validates application responsiveness every 30 seconds.
- `CMD ["node", "server.js"]`: Defines the default execution entrypoint.

## 12. .dockerignore
The `.dockerignore` file prevents unneeded files, build artifacts, and secrets from entering the Docker build context:

```text
# Ignore dependencies and build artifacts
**/node_modules
**/dist
**/build

# Ignore version control and secrets
.git
.gitignore
.env
.env.*
!.env.example

# Ignore documentation, evidence, and infrastructure files
docs/
evidence/
infrastructure/
*.md

# Ignore logs and temporary files
*.log
npm-debug.log*

# Ignore IDE and OS files
.vscode/
.idea/
.DS_Store
```

**Benefits**:
- Dramatically reduces build context transfer time.
- Prevents host machine `node_modules` from polluting the container filesystem.
- Shields sensitive local secrets (`.env`) from accidental image baking.

## 13. Docker Build
To build the GyneCare container image:

```bash
docker build -t gynecare-app:v1 .
```

### Build Execution Summary
```text
#1 [internal] load build definition from Dockerfile
#2 [internal] load metadata for docker.io/library/node:20-alpine
#3 [1/8] FROM docker.io/library/node:20-alpine
#4 [2/8] WORKDIR /app
#5 [3/8] RUN apk add --no-cache curl
#6 [4/8] RUN addgroup -S gynecaregroup && adduser -S gynecareuser -G gynecaregroup
#7 [5/8] COPY server/package*.json ./
#8 [6/8] RUN npm install --omit=dev --no-audit --no-fund
#9 [7/8] COPY server/ ./
#10 [8/8] RUN chown -R gynecareuser:gynecaregroup /app
#11 exporting to image
#12 naming to docker.io/library/gynecare-app:v1
```

## 14. Docker Image Verification
List and inspect the built Docker image:

```bash
docker images gynecare-app:v1
```

**Verified Output:**
```text
IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
gynecare-app:v1   7ca76b681224        480MB          113MB
```

## 15. Docker Container Execution
Run the GyneCare container in detached mode with port publishing and a meaningful container name:

```bash
docker run -d -p 5000:5000 --name gynecare-container gynecare-app:v1
```

**Container ID Output:**
```text
a43dd1b3172b228a41797771a077f3ddeb363af9c3b2e9a191324fc356d579e1
```

### Command Flags:
- `-d`: Detached mode (runs container asynchronously in background).
- `-p 5000:5000`: Maps host port 5000 to container port 5000.
- `--name gynecare-container`: Assigns a human-readable identifier.
- `gynecare-app:v1`: Target image and tag.

## 16. Port Mapping
Port translation allows external clients to communicate with the containerized process:

```
Host Browser / Client ──────> Host Interface (0.0.0.0:5000)
                                      │
                               Docker Port Forwarding (-p 5000:5000)
                                      ▼
                               Container Network Interface (eth0:5000)
                                      ▼
                               Node.js Express Server (server.js)
```

Verify the active port mapping:
```bash
docker ps --filter "name=gynecare-container"
```
**Output:**
```text
CONTAINER ID   IMAGE             COMMAND                  STATUS                   PORTS                                         NAMES
a43dd1b3172b   gynecare-app:v1   "docker-entrypoint.s…"   Up 5 minutes (healthy)   0.0.0.0:5000->5000/tcp, [::]:5000->5000/tcp   gynecare-container
```

## 17. Application Testing
Verify endpoint responsiveness from the host:

### Root Endpoint
```bash
curl http://localhost:5000/
```
**Response:**
```json
{
  "message": "GyneCare Hospital Management System API is running inside Docker.",
  "status": "healthy",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "doctors": "/api/doctors",
    "hospitals": "/api/hospitals",
    "packages": "/api/packages",
    "blogs": "/api/blogs"
  }
}
```

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```
**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "service": "GyneCare Hospital Management API",
  "uptime": 666.41,
  "timestamp": "2026-09-27T14:53:34.410Z"
}
```

## 18. Docker Logs
Inspect container output logs:

```bash
docker logs gynecare-container
```
**Log Output:**
```text
GyneCare API server listening on http://0.0.0.0:5000
[Database Notice] MongoDB at mongodb://127.0.0.1:27017/hospitalDB is not yet available: connect ECONNREFUSED 127.0.0.1:27017
Retrying database connection in 5 seconds...
```
To continuously stream logs:
```bash
docker logs -f gynecare-container
```

## 19. Container Lifecycle
Execute the standard container lifecycle commands:

```bash
# 1. Execute an interactive diagnostics command inside container
docker exec gynecare-container whoami
# Output: gynecareuser

# 2. Check running process directory inside container
docker exec gynecare-container pwd
# Output: /app

# 3. Stop the running container
docker stop gynecare-container

# 4. View stopped container in process list
docker ps -a --filter "name=gynecare-container"
# Output shows: STATUS Exited (137)

# 5. Start the stopped container again
docker start gynecare-container

# 6. Restart container
docker restart gynecare-container

# 7. Inspect container state
docker inspect --format="{{.State.Status}}" gynecare-container
# Output: running

# 8. Clean up container
docker stop gynecare-container
docker rm gynecare-container
```

## 20. Troubleshooting Guide

| Issue | Root Cause | Remediation |
|---|---|---|
| `bind: address already in use` | Host port 5000 is occupied by another process | Map to an alternate host port (`-p 5001:5000`) or stop conflicting process |
| `Connection refused` from host | Server bound to `127.0.0.1` inside container | Ensure `server.js` binds to `0.0.0.0` so container bridges route traffic |
| Container exits immediately | Node command syntax error or missing package | Inspect exit reason with `docker logs <container-name>` |
| Slow build times | `node_modules` sent in context | Add `**/node_modules` to `.dockerignore` |
| Health check status `unhealthy` | Missing `curl` or incorrect endpoint URL | Install `curl` via `apk add --no-cache curl` in Dockerfile |

## 21. Before Docker vs. After Docker

```
Before Docker (Traditional Host Deployment)
Host Machine (Windows/Linux/macOS)
├── Node.js (Must be pre-installed with exact version >=18)
├── npm / pnpm dependencies (Local installation required)
├── System libraries & curl (Manual host configuration)
└── Environment drift ("Works on my machine" syndrome)

After Docker (Containerized Deployment)
Host Machine (Any OS with Docker Engine)
└── Docker Container (Isolated Sandbox)
    ├── Node.js 20 LTS Alpine Runtime
    ├── Isolated production dependencies (/app/node_modules)
    ├── Bound network ports (5000:5000)
    └── Predictable, immutable execution environment
```

## 22. Summary of Useful Docker Commands

| Command | Operational Purpose |
|---|---|
| `docker --version` | Verify client and engine version |
| `docker build -t <image>:<tag> .` | Build image from Dockerfile in current directory |
| `docker images` | List locally available Docker images |
| `docker run -d -p <host>:<cont> --name <name> <image>` | Run detached container with port forwarding |
| `docker ps` | List currently running containers |
| `docker ps -a` | List all containers including exited ones |
| `docker logs <name>` | Display container stdout/stderr output |
| `docker exec -it <name> <cmd>` | Run diagnostic command inside active container |
| `docker stop <name>` | Gracefully stop running container (SIGTERM -> SIGKILL) |
| `docker start <name>` | Restart previously stopped container |
| `docker rm <name>` | Delete container from storage |
| `docker rmi <image>` | Remove image from local cache |
| `docker inspect <name>` | View detailed JSON runtime configuration and health |

## 23. DevOps Relevance
Containerization forms the baseline of modern continuous integration and continuous deployment (CI/CD) pipelines. By packaging the GyneCare application into an immutable Docker image:
- Deployments become idempotent and reproducible across local laptops, staging clusters, and production cloud VMs.
- Vulnerabilities are contained within non-root, isolated user namespaces.
- Rollbacks simply involve deploying a previous image tag (`gynecare-app:v0` vs `v1`).
- Container orchestration (Kubernetes, AWS ECS, Docker Compose) can seamlessly scale the service horizontally.

## 24. Results
- The GyneCare backend application was containerized using Alpine Linux Node 20.
- Image `gynecare-app:v1` built with a compact content size of 113MB.
- Container `gynecare-container` executed with status `healthy`.
- Endpoints `GET /` and `GET /api/health` responded with 200 OK.
- Complete container lifecycle was verified and documented.

## 25. Limitations
- **Single Component**: Assignment 4 containerizes the standalone backend; frontend delivery and MongoDB database persistence require multi-container orchestration.
- **Data Persistence**: Data written inside a container writable layer is ephemeral and lost upon container removal unless Docker volumes are configured.
- **Database Dependency**: Standalone container runs require a separate database network connection.

## 26. Conclusion
Assignment 4 successfully transformed the GyneCare Hospital Management backend from a manually installed application into a containerized microservice. This establishes the container foundation required for the multi-container Docker Compose architecture implemented in Assignment 5.
