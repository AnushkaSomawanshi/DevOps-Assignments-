# GyneCare — Hospital Management System (DevOps Engineering)

## 1. Project Title
**GyneCare Hospital Management System — DevOps Implementation & Infrastructure Engineering**

## 2. Project Overview
GyneCare is an enterprise-grade hospital management and patient care platform. This repository represents the end-to-end DevOps engineering workflow for GyneCare, establishing reproducible local setups, cloud infrastructure automation, containerization, and multi-container orchestration across Assignments 1 through 5.

## 3. Application Overview
The core application delivers specialized healthcare workflows including patient registration, doctor consultation scheduling, preventive healthcare package cataloging, medical record management, and an interactive healthcare assistant. The system is engineered as a three-tier architecture:
- **Presentation Tier**: Responsive Single Page Application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS.
- **Application Tier**: RESTful API service developed in Node.js and Express.js with modular controllers, health monitoring, and CORS integration.
- **Data Tier**: Persistent document database powered by MongoDB 7.0 and Mongoose with automated seed data population.

## 4. Technology Stack

| Layer / Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, Lucide Icons, Radix UI |
| **Backend** | Node.js (>=18 LTS), Express 4.21.2, CORS, Dotenv, Mongoose 8.9.5 |
| **Database** | MongoDB 7.0 Community Server |
| **Containerization** | Docker Engine (v29.7.2), Docker CLI, Multi-stage builds, Alpine Linux |
| **Orchestration** | Docker Compose (v5.5.0), Custom Bridge Network, Persistent Named Volumes |
| **Infrastructure as Code** | HashiCorp Terraform (>= 1.6.0), AWS Provider (~> 5.0) |
| **Cloud Target** | Amazon Web Services (AWS EC2, VPC, Security Groups, Encrypted gp3 EBS) |
| **Reverse Proxy** | Nginx Alpine (Edge routing, gzip compression, SPA history fallback) |

## 5. System Architecture

```
                                  ┌──────────────────────────┐
                                  │       Client Users       │
                                  └────────────┬─────────────┘
                                               │
                                               │ HTTP / HTTPS
                                               ▼
                             ┌───────────────────────────────────┐
                             │       Nginx Reverse Proxy         │
                             │       (Port 80 / Host: 3000)      │
                             └─────────┬───────────────┬─────────┘
                                       │               │
                     Static Assets (/) │               │ API Proxy (/api/*)
                                       ▼               ▼
                        ┌──────────────────┐   ┌──────────────────┐
                        │  React 19 Vite   │   │  Express.js API  │
                        │  Production SPA  │   │  (Port 5000)     │
                        └──────────────────┘   └────────┬─────────┘
                                                        │
                                                        │ Mongoose Driver (TCP)
                                                        ▼
                                               ┌──────────────────┐
                                               │   MongoDB 7.0    │
                                               │   (Port 27017)   │
                                               └────────┬─────────┘
                                                        │
                                                        ▼ Mount: /data/db
                                               ┌──────────────────┐
                                               │  Named Volume    │
                                               │  (Persistent)    │
                                               └──────────────────┘
```

## 6. Repository Structure

```text
BOT-MERN-Gynecare-Hospital-Management-System-/
├── compose.yaml                          # Master Docker Compose multi-container orchestrator
├── Dockerfile                            # Production backend container definition
├── .dockerignore                         # Backend build context exclusions
├── .env.example                          # Secret-free environment variable template
├── package.json                          # Workspace root scripts
├── client/                               # Frontend React Application
│   ├── Dockerfile                        # Multi-stage Dockerfile (Node build -> Nginx serve)
│   ├── .dockerignore                     # Frontend build context exclusions
│   ├── nginx.conf                        # Nginx SPA and reverse proxy configuration
│   ├── package.json                      # Client dependencies and build scripts
│   ├── vite.config.js                    # Vite configuration and proxy setup
│   └── src/                              # React application source code
├── server/                               # Backend Express API Server
│   ├── Dockerfile                        # Server container Dockerfile
│   ├── .dockerignore                     # Server context exclusions
│   ├── package.json                      # Backend dependencies
│   ├── server.js                         # Application entrypoint & health routes
│   ├── config/db.js                      # MongoDB connection handler
│   ├── controllers/                      # Business logic controllers
│   ├── models/                           # Mongoose data schemas
│   ├── routes/                           # API route handlers
│   └── utils/seed.js                     # Seed data initialization utility
├── infrastructure/                       # Cloud & IaC Configurations
│   └── terraform/aws-ec2/                # Terraform EC2 provisioning module
│       ├── versions.tf                   # Terraform and provider constraints
│       ├── provider.tf                   # AWS provider configuration
│       ├── variables.tf                  # Typed input variables
│       ├── main.tf                       # EC2 and Security Group resources
│       ├── outputs.tf                    # Computed infrastructure outputs
│       └── terraform.tfvars.example      # Variable values template
├── docs/                                 # Detailed DevOps Technical Documentation
│   ├── assignment-1/                     # MERN Baseline & System Architecture
│   ├── assignment-2/                     # AWS EC2 Cloud Deployment
│   ├── assignment-3/                     # Terraform Infrastructure as Code
│   ├── assignment-4/                     # Docker Application Containerization
│   └── assignment-5/                     # Docker Compose Multi-Container Orchestration
└── evidence/                             # Verification Registers & Execution Proofs
```

## 7. Application Components
1. **Frontend Service**: Hosted via Nginx on port 3000. Delivers the client SPA with seamless client-side routing and reverse-proxies `/api/` calls internally to the backend.
2. **Backend Service**: Listens on port 5000. Provides health probes (`/api/health`), authentication, and REST resources for appointments, doctors, hospitals, and blogs.
3. **Database Service**: MongoDB 7.0 engine storing all persistent healthcare records on an isolated network.

## 8. Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB (v6.0 or higher) running on `localhost:27017`

### Step-by-Step Run
```bash
# 1. Clone repository
git clone https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git
cd DevOps-Assignments-/BOT-MERN-Gynecare-Hospital-Management-System-

# 2. Configure Backend
cd server
npm install
node server.js

# 3. Configure Frontend (in a separate terminal)
cd ../client
npm install
npm run dev
```
Frontend development server: `http://localhost:5173`  
Backend development server: `http://localhost:5000`

## 9. Environment Configuration
Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express backend server |
| `FRONTEND_PORT` | `3000` | Published port for frontend web container |
| `MONGO_PORT` | `27017` | Published port for MongoDB database |
| `MONGO_DATABASE` | `hospitalDB` | Target database name |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/hospitalDB` | Local bare-metal connection URI |
| `GEMINI_API_KEY` | *(optional)* | API key for healthcare assistant |

## 10. Docker Setup
The repository provides a production-grade, Alpine-based `Dockerfile` with layer caching, curl healthchecks, and non-privileged execution under `gynecareuser`.

## 11. Docker Compose Setup
The multi-container configuration in `compose.yaml` coordinates:
- `mongodb` service with healthcheck ping and named volume `gynecare_mongodb_data`.
- `backend` service with healthcheck curl, environment injection, and `depends_on: mongodb: condition: service_healthy`.
- `frontend` service with multi-stage Nginx build, port mapping `3000:80`, and `depends_on: backend: condition: service_healthy`.
- `gynecare-network` isolated bridge network for DNS service discovery.

## 12. Terraform / Infrastructure Setup
Located in `infrastructure/terraform/aws-ec2/`, Terraform automates AWS cloud hosting:
- Provisions an EC2 virtual machine (`t3.micro` or `t2.micro`).
- Attaches an encrypted 20 GiB `gp3` Elastic Block Store (EBS) root volume.
- Creates a dedicated AWS Security Group allowing restricted SSH (Port 22) and web traffic (Ports 80/443).
- Exposes computed metadata via `outputs.tf`.

## 13. How to Run the Application (Bare-Metal)
```bash
# Start backend
cd server && npm install && npm start

# In separate terminal, start frontend
cd client && npm install && npm run dev
```

## 14. How to Run with Docker (Assignment 4)
Run the backend application inside an isolated Docker container:

```bash
# 1. Build image
docker build -t gynecare-app:v1 .

# 2. Run container with port forwarding
docker run -d -p 5000:5000 --name gynecare-container gynecare-app:v1

# 3. Verify health
curl http://localhost:5000/api/health

# 4. View container logs
docker logs -f gynecare-container

# 5. Stop and clean up container
docker stop gynecare-container && docker rm gynecare-container
```

## 15. How to Run with Docker Compose (Assignment 5)
Spin up the complete multi-container stack with a single command:

```bash
# 1. Validate configuration
docker compose config

# 2. Build service images
docker compose build

# 3. Start entire stack in detached mode
docker compose up -d

# 4. Check running services
docker compose ps

# 5. Access application
# Web App UI: http://localhost:3000
# Backend API: http://localhost:5000/api/health
# Database Seeded Records: http://localhost:5000/api/doctors

# 6. View logs across all services
docker compose logs -f

# 7. Stop stack (safeguards persistent volume)
docker compose down
```

## 16. Important Ports

| Port | Service | Container Host | Function |
|---|---|---|---|
| `3000` | Frontend Web UI | `gynecare-frontend` | Nginx HTTP entrypoint for users |
| `5000` | Express REST API | `gynecare-backend` | Healthchecks, authentication, CRUD APIs |
| `27017`| MongoDB Database | `gynecare-mongodb` | Internal document storage |
| `22`   | SSH Access (EC2)| Host Machine | Administrative remote terminal access |

## 17. Important Environment Variables
- `PORT`: Specifies application server listening port.
- `MONGO_URI`: Formats the database connection string. In Compose, set to `mongodb://mongodb:27017/hospitalDB`.
- `NODE_ENV`: Set to `production` in container environments.
- `AWS_REGION`: Defines deployment region for Terraform (`us-east-1`).

## 18. DevOps Assignments Overview

| Assignment | Topic | Focus | Primary Location | Detailed Guide |
|---|---|---|---|---|
| **Assignment 1** | MERN Base Application | Three-tier architecture, React frontend, Express API, MongoDB seeding | `client/`, `server/` | [Assignment 1 Docs](docs/assignment-1/assignment-1-documentation.md) |
| **Assignment 2** | Cloud Computing (AWS EC2) | Virtual machine lifecycle, VPC, Security Groups, SSH, manual hosting | `docs/assignment-2/` | [Assignment 2 Docs](docs/assignment-2/assignment-2-documentation.md) |
| **Assignment 3** | Infrastructure as Code | HashiCorp Terraform automation for EC2 and Security Groups | `infrastructure/terraform/aws-ec2/` | [Assignment 3 Docs](docs/assignment-3/assignment-3-documentation.md) |
| **Assignment 4** | Application Containerization | Alpine Dockerfile, `.dockerignore`, image build, container lifecycle, healthcheck | `Dockerfile`, `.dockerignore` | [Assignment 4 Docs](docs/assignment-4/assignment-4-documentation.md) |
| **Assignment 5** | Multi-Container Orchestration | Docker Compose (`compose.yaml`), Nginx reverse proxy, named volumes, custom bridge | `compose.yaml`, `client/Dockerfile` | [Assignment 5 Docs](docs/assignment-5/assignment-5-documentation.md) |

## 19. Documentation Locations
Comprehensive technical reports with architectural diagrams, command outputs, and troubleshooting matrices are located in:
- [Assignment 1 — Base Application Architecture](docs/assignment-1/README.md)
- [Assignment 2 — AWS EC2 Deployment](docs/assignment-2/README.md)
- [Assignment 3 — Terraform Infrastructure as Code](docs/assignment-3/README.md)
- [Assignment 4 — Docker Application Containerization](docs/assignment-4/README.md)
- [Assignment 5 — Multi-Container Docker Compose](docs/assignment-5/README.md)

## 20. Security Notes
- **Zero Secrets in Git**: No API keys, passwords, private SSH keys, or AWS access tokens are committed to source control.
- **Ignored State**: `terraform.tfstate`, `.env`, and `node_modules` are explicitly excluded via `.gitignore`.
- **Non-Root Containers**: Docker images run under dedicated unprivileged users (`gynecareuser`).
- **Network Isolation**: MongoDB is protected within the private Docker bridge network (`gynecare-network`).
- **Encrypted Storage**: EBS storage on AWS is encrypted at rest using AES-256 (`gp3`).

## 21. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Port collision on 5000 / 3000 | Existing process running on host | Set `PORT=5001 FRONTEND_PORT=3001 docker compose up -d` or kill conflicting PID |
| MongoDB connection deferred | Database container still starting | The backend features automatic retry logic; check health via `docker compose ps` |
| White screen on frontend | Missing Nginx SPA fallback | Nginx includes `try_files $uri $uri/ /index.html;` in `client/nginx.conf` |
| Build context too large | `node_modules` not ignored | Verify `.dockerignore` contains `**/node_modules` |

## 22. Conclusion & Summary
The GyneCare DevOps project represents a complete, professional engineering progression: starting from a full-stack MERN application, migrating to cloud infrastructure concepts, defining infrastructure as code with Terraform, containerizing application components with Docker, and orchestrating resilient multi-tier microservices with Docker Compose.
