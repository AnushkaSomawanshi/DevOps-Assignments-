# Assignment 5 — Multi-Container Application Orchestration with Docker Compose

## 1. Assignment Title
**Multi-Container Orchestration of GyneCare MERN Application Using Docker Compose**

## 2. Aim
To explore multi-container application design, inter-service networking, persistent data volumes, and environment parameterization, and to orchestrate the complete GyneCare Hospital Management platform (React Frontend, Express Backend API, and MongoDB Database) using a modern `compose.yaml` specification.

## 3. Objectives
- Design and implement a multi-tier microservice architecture for the GyneCare MERN application.
- Author a declarative `compose.yaml` file configuring services, builds, image tags, ports, environment variables, dependencies, volumes, and networks.
- Configure MongoDB as a persistent database service utilizing named Docker volumes (`gynecare_mongodb_data`).
- Configure an isolated Docker bridge network (`gynecare-network`) enabling DNS-based service discovery and inter-container communication without exposing database ports publicly.
- Establish proper startup sequencing and container health checks using `depends_on` conditions.
- Implement production-grade Nginx reverse proxying inside the frontend container to route `/api/*` traffic seamlessly to the backend.
- Execute and verify the complete Docker Compose operational lifecycle.

## 4. Learning Outcomes
- Understanding multi-container application architecture and decoupling concerns across presentation, logic, and persistence layers.
- Mastering Docker Compose orchestration syntax, version specifications, and service definitions.
- Configuring named persistent volumes to survive container destruction and restarts.
- Implementing container-to-container communication using internal service names (e.g., `mongodb:27017` and `backend:5000`) instead of fragile `localhost` bindings.
- Differentiating between `docker compose down` (preserves data) and `docker compose down -v` (purges volumes).
- Diagnosing cross-service networking and startup timing dependencies.

## 5. Docker Compose Introduction
Docker Compose is a declarative tool for defining and executing multi-container Docker applications. Through a single YAML configuration file (`compose.yaml`), engineers define the desired state of entire application environments—including multiple inter-dependent containers, private networks, persistent storage volumes, and environment configurations. A single command (`docker compose up -d`) builds, creates, connects, and starts all required services in their proper dependency sequence.

## 6. Multi-Container Architecture

```
                                  ┌──────────────────────────┐
                                  │   Host Machine Browser   │
                                  └────────────┬─────────────┘
                                               │
                         HTTP Port 3000        │        HTTP Port 5000 (API Direct)
                        ┌──────────────────────┴──────────────────────┐
                        │                                             │
                        ▼                                             ▼
       ┌─────────────────────────────────┐           ┌─────────────────────────────────┐
       │   Frontend Service (Nginx)      │           │   Backend Service (Express API) │
       │   Container: gynecare-frontend  │           │   Container: gynecare-backend   │
       │   Port 80 (Published as 3000)   │           │   Port 5000 (Published as 5000) │
       └────────────────┬────────────────┘           └────────────────┬────────────────┘
                        │                                             │
                        │ Reverse Proxy /api/* (Internal Port 5000)   │
                        └──────────────────────┬──────────────────────┘
                                               │
                                               │ TCP Port 27017 (DNS: mongodb)
                                               ▼
                               ┌─────────────────────────────────┐
                               │   Database Service (MongoDB)    │
                               │   Container: gynecare-mongodb   │
                               │   Port 27017 (Published 27017)  │
                               └────────────────┬────────────────┘
                                                │
                                                ▼ Mount: /data/db
                               ┌─────────────────────────────────┐
                               │     Named Persistent Volume     │
                               │     `gynecare_mongodb_data`     │
                               └─────────────────────────────────┘
     ════════════════════════════════════════════════════════════════════════════════════════
                        Isolated Docker Network: `gynecare-network` (bridge)
```

## 7. GyneCare Architecture
The GyneCare MERN platform is decomposed into three coordinated services:
1. **Frontend (`frontend`)**: React 19 Single Page Application built with Vite and served via Nginx on Alpine Linux. It handles user interactions, appointment booking interfaces, patient dashboards, and doctors directories. Nginx acts as an edge reverse proxy forwarding API calls to the backend.
2. **Backend (`backend`)**: Node.js/Express.js REST API providing business logic, authentication controllers, data seeding routines, and healthcare services.
3. **Database (`mongodb`)**: MongoDB 7.0 Community edition managing persistent document collections for users, doctors, hospitals, appointments, and blogs.

## 8. Project Structure
The multi-container configuration is integrated directly into the GyneCare workspace:

```text
BOT-MERN-Gynecare-Hospital-Management-System-/
├── compose.yaml                # Master multi-container orchestration file
├── Dockerfile                  # Production backend container image definition
├── .dockerignore               # Backend build context exclusions
├── .env.example                # Safe environment variable configuration template
├── client/                     # Frontend Service Directory
│   ├── Dockerfile              # Multi-stage frontend Dockerfile (Node build -> Nginx)
│   ├── .dockerignore           # Frontend build context exclusions
│   ├── nginx.conf              # Nginx SPA routing and /api/ reverse proxy configuration
│   └── src/                    # React source code
└── server/                     # Backend Service Directory
    ├── Dockerfile              # Backend standalone Dockerfile
    ├── config/db.js            # MongoDB connection logic
    └── server.js               # Express application entrypoint
```

## 9. Services Definition

| Service Name | Container Name | Image / Build Context | Exposed Ports | Health Check Endpoint |
|---|---|---|---|---|
| `mongodb` | `gynecare-mongodb` | `mongo:7.0` | `27017:27017` | `mongosh --eval "db.adminCommand('ping')"` |
| `backend` | `gynecare-backend` | `gynecare-backend:latest` (`./Dockerfile`) | `5000:5000` | `curl -f http://localhost:5000/api/health` |
| `frontend` | `gynecare-frontend` | `gynecare-frontend:latest` (`./client/Dockerfile`) | `3000:80` | Nginx HTTP listener |

## 10. compose.yaml
The complete, production-ready `compose.yaml` specification:

```yaml
# ==============================================================================
# GyneCare Hospital Management System - Docker Compose Configuration (Assignment 5)
# Multi-container orchestration: Frontend (React/Nginx) + Backend (Node/Express) + Database (MongoDB)
# ==============================================================================

services:
  # ----------------------------------------------------------------------------
  # Database Service: MongoDB NoSQL Database
  # ----------------------------------------------------------------------------
  mongodb:
    image: mongo:7.0
    container_name: gynecare-mongodb
    restart: unless-stopped
    ports:
      - "${MONGO_PORT:-27017}:27017"
    environment:
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE:-hospitalDB}
    volumes:
      - mongodb_data:/data/db
    networks:
      - gynecare-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 5s

  # ----------------------------------------------------------------------------
  # Backend API Service: GyneCare Express/Mongoose Application
  # ----------------------------------------------------------------------------
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    image: gynecare-backend:latest
    container_name: gynecare-backend
    restart: unless-stopped
    ports:
      - "${PORT:-5000}:5000"
    environment:
      PORT: 5000
      NODE_ENV: production
      MONGO_URI: mongodb://mongodb:27017/${MONGO_DATABASE:-hospitalDB}
      GEMINI_API_KEY: ${GEMINI_API_KEY:-}
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - gynecare-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 5s

  # ----------------------------------------------------------------------------
  # Frontend Web Service: React 19 / Vite SPA served via Nginx
  # ----------------------------------------------------------------------------
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    image: gynecare-frontend:latest
    container_name: gynecare-frontend
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-3000}:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - gynecare-network

# ------------------------------------------------------------------------------
# Persistent Volumes: Retain Database records across container lifecycles
# ------------------------------------------------------------------------------
volumes:
  mongodb_data:
    name: gynecare_mongodb_data

# ------------------------------------------------------------------------------
# Networks: Isolated bridge network for internal inter-service communication
# ------------------------------------------------------------------------------
networks:
  gynecare-network:
    name: gynecare-network
    driver: bridge
```

## 11. Detailed Compose File Explanation
- **`services`**: Defines the three coordinated application components (`mongodb`, `backend`, `frontend`).
- **`build` blocks**: Directs Docker to build images locally (`backend` from root context, `frontend` from `client/` context).
- **`restart: unless-stopped`**: Enforces process self-healing; crashed containers automatically restart.
- **`depends_on with condition: service_healthy`**: Implements true readiness synchronization:
  - `backend` waits until `mongodb` has executed its internal ping healthcheck.
  - `frontend` waits until `backend` responds 200 OK to `/api/health`.
- **`environment`**: Parameterizes runtime settings (e.g., `MONGO_URI: mongodb://mongodb:27017/hospitalDB`) using variable substitution syntax with safe fallbacks (`${VAR:-default}`).
- **`volumes`**: Attaches named volume `gynecare_mongodb_data` to MongoDB's internal data directory `/data/db`.
- **`networks`**: Connects all three services to the shared custom bridge network `gynecare-network`.

## 12. Ports Configuration

| Service | Host Port | Container Port | Protocol | Usage |
|---|---|---|---|---|
| `frontend` | 3000 | 80 | TCP | Main web UI accessed via browser (`http://localhost:3000`) |
| `backend` | 5000 | 5000 | TCP | Direct REST API access and health endpoint (`http://localhost:5000`) |
| `mongodb` | 27017 | 27017 | TCP | Database listener (published for local debugging; accessible internally via `mongodb:27017`) |

## 13. Environment Variables
Environment variables are managed safely via `.env.example`:

```bash
# Application Ports
PORT=5000
FRONTEND_PORT=3000
MONGO_PORT=27017

# Database Name
MONGO_DATABASE=hospitalDB

# Optional API Keys
GEMINI_API_KEY=
```

No hardcoded secrets or credentials exist in `compose.yaml`. Values are cleanly injected at runtime.

## 14. Volumes & Data Persistence
Database persistence is critical in healthcare applications. In Docker:
- Any file written inside an unmounted container filesystem is written to the ephemeral writable container layer. When `docker compose down` removes the container, all unmounted data is permanently destroyed.
- **Solution**: Named Docker volume `gynecare_mongodb_data` is mounted to `/data/db` inside `gynecare-mongodb`.

### Volume Verification
```bash
docker volume ls --filter "name=gynecare"
```
**Output:**
```text
DRIVER    VOLUME NAME
local     gynecare_mongodb_data
```

### `docker compose down` vs. `docker compose down -v`

| Command | Action on Containers | Action on Networks | Action on Volumes | Use Case |
|---|---|---|---|---|
| `docker compose down` | Stopped and Removed | Removed | **Preserved intact** | Standard maintenance, code deployments, container restarts |
| `docker compose down -v` | Stopped and Removed | Removed | **Permanently Deleted** | Complete environment wipe and clean database resets |

## 15. Networking
Docker Compose provisions an isolated user-defined bridge network named `gynecare-network`:

```bash
docker network ls --filter "name=gynecare"
```
**Output:**
```text
NETWORK ID     NAME               DRIVER    SCOPE
9019e2eaaf67   gynecare-network   bridge    local
```

### DNS-Based Service Discovery
Docker's embedded DNS server (`127.0.0.11`) automatically resolves service names to their respective container IP addresses within the network:
- `backend` addresses MongoDB using hostname `mongodb` (`mongodb://mongodb:27017/hospitalDB`).
- `frontend` Nginx proxies API calls using hostname `backend` (`http://backend:5000/api/`).
- Containers do NOT rely on hardcoded IP addresses or `localhost` bindings.

## 16. Service-to-Service Communication Flow
1. **Patient loads UI**: Browser connects to `http://localhost:3000`.
2. **Nginx serves React Bundle**: Static assets are loaded with zero backend latency.
3. **Client fetches Doctors list**: React application makes a GET request to `/api/doctors`.
4. **Nginx Reverse Proxies**: Nginx receives `/api/doctors`, matches `location /api/`, and forwards the request over `gynecare-network` to `http://backend:5000/api/doctors`.
5. **Backend queries MongoDB**: Express server queries `mongodb://mongodb:27017/hospitalDB` via Mongoose.
6. **Data returns through stack**: MongoDB returns document records -> Express transforms JSON -> Nginx delivers to browser.

## 17. Compose Workflow

```
                        ┌────────────────────────────────────────┐
                        │      docker compose config             │ (Validates YAML syntax)
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      docker compose build              │ (Builds backend & frontend images)
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      docker compose up -d              │ (Creates network, volume, containers)
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      docker compose ps                 │ (Verifies healthy status)
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      docker compose logs -f            │ (Inspects operational logs)
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      docker compose down               │ (Stops & removes containers safely)
                        └────────────────────────────────────────┘
```

## 18. Compose Commands Reference

| Command | Operational Purpose |
|---|---|
| `docker compose version` | Display Docker Compose plugin version |
| `docker compose config` | Parse, validate, and render compose YAML with environment variables |
| `docker compose build` | Build or rebuild service images defined in compose |
| `docker compose up -d` | Create and start all containers in detached mode |
| `docker compose ps` | Display status, ports, and health of stack services |
| `docker compose logs` | View combined or service-specific stdout/stderr output |
| `docker compose logs -f <svc>` | Stream live logs for a specific service (`backend`, `frontend`, `mongodb`) |
| `docker compose stop` | Stop running containers without removing them |
| `docker compose start` | Start previously stopped stack containers |
| `docker compose restart` | Restart stack services |
| `docker compose down` | Stop containers, remove containers, and remove networks |
| `docker compose down -v` | Teardown stack AND permanently destroy persistent volumes |

## 19. Build and Startup
Execute configuration validation and build:

```bash
docker compose config
docker compose build
docker compose up -d
```

### Verified Startup Sequence
```text
Network gynecare-network Created
Volume gynecare_mongodb_data Created
Container gynecare-mongodb Created
Container gynecare-backend Created
Container gynecare-frontend Created
Container gynecare-mongodb Started
Container gynecare-mongodb Healthy
Container gynecare-backend Started
Container gynecare-backend Healthy
Container gynecare-frontend Started
```

## 20. Service Verification
Inspect running services:

```bash
docker compose ps
```

**Verified Output:**
```text
NAME                IMAGE                      COMMAND                  SERVICE    STATUS                    PORTS
gynecare-backend    gynecare-backend:latest    "docker-entrypoint.s…"   backend    Up 52 seconds (healthy)   0.0.0.0:5000->5000/tcp
gynecare-frontend   gynecare-frontend:latest   "/docker-entrypoint.…"   frontend   Up 46 seconds             0.0.0.0:3000->80/tcp
gynecare-mongodb    mongo:7.0                  "docker-entrypoint.s…"   mongodb    Up 59 seconds (healthy)   0.0.0.0:27017->27017/tcp
```

## 21. Application Testing
Verify that all application layers respond correctly:

### Backend Health Check (Port 5000)
```bash
curl http://localhost:5000/api/health
```
**Output:**
```json
{
  "ok": true,
  "status": "healthy",
  "service": "GyneCare Hospital Management API",
  "uptime": 53.05,
  "timestamp": "2026-09-27T15:25:24.878Z"
}
```

### Frontend Web UI Delivery (Port 3000)
```bash
curl http://localhost:3000/
```
**Output:** Returns compiled HTML containing:
`<title>GyneCare Hospital — Compassionate Women's Healthcare</title>`

### End-to-End Reverse Proxy Check
```bash
curl http://localhost:3000/api/health
```
**Output:** Successfully proxies from port 3000 to backend port 5000, returning `{ "ok": true, "status": "healthy" }`.

## 22. Database Connectivity & Seeding
Verify that the backend successfully connected to the MongoDB container and initialized seed data:

```bash
curl http://localhost:5000/api/doctors
```

**Verified Seed Data Output (Truncated Sample):**
```json
[
  {
    "_id": "6ab93533d7b172d16458f7f6",
    "id": "d1",
    "name": "Dr. Priya Sharma",
    "speciality": "Obstetrics & Gynecology",
    "qualification": "MD, DGO, FRCOG",
    "experience": 18,
    "hospitalName": "GyneCare Hospital — Pune Main",
    "location": "Pune",
    "consultationFee": 800
  },
  {
    "_id": "6ab93533d7b172d16458f7f8",
    "id": "d3",
    "name": "Dr. Sunita Patil",
    "speciality": "Gynecologic Oncology",
    "qualification": "MS, MCh Oncology",
    "experience": 22,
    "hospitalName": "GyneCare Hospital — Mumbai",
    "location": "Mumbai",
    "consultationFee": 1500
  }
]
```

## 23. Log Verification

### MongoDB Logs
```bash
docker compose logs mongodb
```
Output confirms listener active:
`"msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}`

### Backend Logs
```bash
docker compose logs backend
```
Output confirms startup and database connection:
```text
gynecare-backend | GyneCare API server listening on http://0.0.0.0:5000
gynecare-backend | Connected to MongoDB and seeded initial records successfully.
```

### Frontend Logs
```bash
docker compose logs frontend
```
Output confirms Nginx worker processes running and proxying requests.

## 24. Container Lifecycle Verification
```bash
# 1. Stop all services
docker compose stop
# Status shows all containers Exited

# 2. Restart all services
docker compose start
# Status returns to Up and healthy

# 3. Clean teardown
docker compose down
# Containers and network removed, volume preserved
```

## 25. Troubleshooting Guide

| Symptom | Root Cause | Solution |
|---|---|---|
| Backend crashes on launch | MongoDB container not ready | Use `depends_on: condition: service_healthy` and implement retry logic in `server.js` |
| Frontend displays blank white page | Static files 404 or bad routing | Ensure Nginx `try_files $uri $uri/ /index.html;` is present in `nginx.conf` |
| `/api/*` returns 502 Bad Gateway | Nginx cannot resolve `backend` | Verify both containers belong to `gynecare-network` and backend port is 5000 |
| Seed data lost after restart | No named volume mounted | Ensure `mongodb_data:/data/db` is declared in `volumes` |
| Port collision on host | Host port 27017, 3000, or 5000 occupied | Override port via environment variable (e.g., `PORT=5001 docker compose up -d`) |

## 26. Security Best Practices
- **Non-Root Execution**: Backend container runs under dedicated `gynecareuser`.
- **Database Boundary**: MongoDB is accessible within the internal Docker bridge network; in hardened production, the host port mapping (`27017:27017`) can be omitted completely.
- **Zero Secrets**: Passwords and API keys are not embedded in YAML files.
- **Minimal Images**: Alpine-based images reduce vulnerabilities and malicious attack vectors.

## 27. DevOps Relevance
Docker Compose serves as the cornerstone for microservice development and local orchestration:
- Enables entire multi-tier production topologies to be spun up locally with one command.
- Replaces complex setup wikis and manual installation documents.
- Serves as the blueprint for cloud container orchestration platforms such as AWS ECS (via ECS Compose integration) and Kubernetes (via Kompose translation).

## 28. Results
- Full multi-container GyneCare architecture successfully specified and executed.
- Frontend, Backend, and MongoDB services running and verified healthy.
- Real database records seeded and retrieved via REST APIs.
- Nginx reverse proxying functional on port 3000.
- Data persistence verified across container teardown.

## 29. Advantages Observed
- Instant stack replication: New developers run `docker compose up -d` and have a working hospital system in seconds.
- Isolated networking prevents port and database conflicts with other host software.
- Declarative configuration provides a single auditable source of truth for the entire infrastructure.

## 30. Limitations
- Single Host Orchestration: Docker Compose is designed for single-node deployments; multi-node cluster scaling requires Kubernetes or Docker Swarm.
- Storage Scaling: Local named volumes reside on the Docker host; cloud-scale persistence requires distributed storage (e.g., AWS EBS or MongoDB Atlas).

## 31. Evidence Guidance
When collecting submission evidence:
1. Terminal screenshot: `docker compose config` validation.
2. Terminal screenshot: `docker compose up -d` execution.
3. Terminal screenshot: `docker compose ps` displaying healthy services.
4. Browser screenshot: GyneCare frontend running on `http://localhost:3000`.
5. Browser/Terminal screenshot: JSON output from `http://localhost:5000/api/doctors`.
6. Terminal screenshot: `docker volume ls` and `docker network ls`.

## 32. Requirement Traceability Matrix

| Requirement | Implementation Artifact | Verification Command | Verified Status |
|---|---|---|---|
| Multi-container stack | `compose.yaml` | `docker compose config` | PASS |
| Web service | `client/Dockerfile`, `nginx.conf` | `curl http://localhost:3000` | PASS |
| Database service | `mongo:7.0` | `docker compose logs mongodb` | PASS |
| Persistent Volume | `gynecare_mongodb_data` | `docker volume ls` | PASS |
| Custom Network | `gynecare-network` | `docker network ls` | PASS |
| Health Synchronization | `depends_on: condition: service_healthy` | `docker compose ps` | PASS |
| Reverse Proxy | Nginx `proxy_pass http://backend:5000/api/` | `curl http://localhost:3000/api/health` | PASS |

## 33. Conclusion
Assignment 5 successfully delivers an enterprise-grade multi-container deployment for the GyneCare Hospital Management System. By uniting the React frontend, Node.js Express backend, and MongoDB database through Docker Compose, the application achieves complete environment consistency, robust data persistence, and seamless service discovery.
