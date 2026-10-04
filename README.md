# GyneCare — Hospital Management System (DevOps Engineering)

## 1. Project Title
**GyneCare Hospital Management System — DevOps Implementation & Infrastructure Engineering**

## 2. Project Overview
GyneCare is an enterprise-grade hospital management and patient care platform. This repository documents the complete end-to-end DevOps engineering lifecycle for the GyneCare platform: starting from local full-stack MERN baseline development, progressing through AWS cloud infrastructure provisioning with Terraform, containerization with Docker, multi-container orchestration with Docker Compose, automated Continuous Integration with Jenkins and GitHub, container orchestration and package management with Kubernetes and Helm, core Kubernetes objects and networking models, and automated configuration management using Ansible.

---

## 3. DevOps Progression Story

The repository represents a coherent, industry-aligned DevOps progression across ten comprehensive milestones:

```
                         GYNECARE DEVOPS LIFECYCLE
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       │                             │                             │
  DEVELOPMENT & CI              INFRASTRUCTURE                OPERATIONS
       │                             │                             │
       ▼                             ▼                             ▼
  Git & GitHub                  Terraform IaC                  Ansible CM
  (Version Control)             (Declarative AWS Cloud)       (Multi-Host Nginx)
       │                             │                             │
       ▼                             ▼                             ▼
  Jenkins CI Pipeline           AWS EC2 Cloud Host             Configuration
  (Automated Verification)      (gp3 Storage & Security)       Idempotency
       │
       ▼
  Docker Containerization
  (Multi-Stage Production Builds)
       │
       ▼
  Docker Compose
  (Three-Tier Microservice Stack)
       │
       ▼
  Kubernetes Orchestration
  (Desired State & Self-Healing)
       │
       ▼
  Helm Package Management
  (Templating, Values & Releases)
       │
       ▼
  Kubernetes Objects & Networking
  (ClusterIP, NodePort, LoadBalancer, PVC)
```

---

## 4. Application Overview
The core GyneCare application delivers specialized healthcare workflows including patient registration, doctor consultation scheduling, preventive healthcare package cataloging, medical record management, and an interactive healthcare assistant. The system is engineered as a decoupled three-tier microservice architecture:
- **Presentation Tier**: Responsive Single Page Application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS, served through high-performance Alpine Nginx.
- **Application Tier**: RESTful API service developed in Node.js and Express.js with modular controllers, health monitoring, and CORS integration.
- **Data Tier**: Persistent document database powered by MongoDB Community Server with automated seed data population and persistent volume binding.

---

## 5. Comprehensive Technology Stack

| Layer / Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, Lucide Icons, Radix UI |
| **Backend** | Node.js (>=18 LTS), Express 4.21.2, CORS, Dotenv, Mongoose 8.9.5 |
| **Database** | MongoDB 7.0 Community Server |
| **Containerization** | Docker Engine (v29.7.2), Docker CLI, Multi-stage builds, Alpine Linux |
| **Container Composition** | Docker Compose (v5.5.0), Custom Bridge Network, Persistent Named Volumes |
| **Infrastructure as Code** | HashiCorp Terraform (>= 1.6.0), AWS Provider (~> 5.0) |
| **Cloud Target** | Amazon Web Services (AWS EC2, VPC, Security Groups, Encrypted gp3 EBS) |
| **Continuous Integration** | Jenkins LTS (JDK17), Declarative Pipeline-as-Code (`Jenkinsfile`), Git SCM Integration |
| **Container Orchestration** | Kubernetes (v1.36 client), Pods, Deployments, ReplicaSets, RollingUpdates |
| **Kubernetes Networking** | ClusterIP, NodePort, LoadBalancer, ExternalName, CoreDNS, kube-proxy |
| **Kubernetes Storage & Config** | PersistentVolumes (PV), PersistentVolumeClaims (PVC), ConfigMaps, Secrets |
| **Package Management** | Helm v3, Semantic Versioning, Values-driven Go templating, Release lifecycle |
| **Configuration Management**| Ansible Core, YAML Playbooks, INI Inventory, OpenSSH transport, Idempotent execution |
| **Reverse Proxy / Ingress** | Nginx Alpine (Edge routing, gzip compression, SPA history fallback) |

---

## 6. System Architecture

```
                                  ┌──────────────────────────┐
                                  │       Client Users       │
                                  └────────────┬─────────────┘
                                               │
                                               │ HTTP / HTTPS (Port 3000 / 30080)
                                               ▼
                              ┌───────────────────────────────────┐
                              │       Nginx Reverse Proxy /       │
                              │       Kubernetes NodePort Svc     │
                              └─────────┬───────────────┬─────────┘
                                        │               │
                      Static Assets (/) │               │ API Calls (/api/*)
                                        ▼               ▼
                         ┌──────────────────┐   ┌──────────────────┐
                         │  React 19 Vite   │   │  Express.js API  │
                         │  Production SPA  │   │  (Port 5000)     │
                         └──────────────────┘   └────────┬─────────┘
                                                         │
                                                         │ Mongoose Driver (TCP: 27017)
                                                         ▼
                                                ┌──────────────────┐
                                                │   MongoDB 7.0    │
                                                │   (Port 27017)   │
                                                └────────┬─────────┘
                                                         │
                                                         ▼ Persistent Storage
                                                ┌──────────────────┐
                                                │  Named Volume /  │
                                                │  K8s Storage PVC │
                                                └──────────────────┘
```

---

## 7. Repository Structure

```text
BOT-MERN-Gynecare-Hospital-Management-System-/
├── compose.yaml                          # Master Docker Compose multi-container stack
├── Dockerfile                            # Production backend container definition
├── Jenkinsfile                           # 5-Stage Declarative CI Pipeline-as-Code
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
├── docker/                               # Supporting Container Environments
│   └── jenkins/                          # Dockerized Jenkins LTS laboratory
│       ├── compose.yaml                  # Jenkins LTS controller service definition
│       └── README.md                     # Jenkins lab setup & authentication guide
├── infrastructure/                       # Cloud & IaC Configurations
│   └── terraform/aws-ec2/                # Terraform EC2 provisioning module
│       ├── versions.tf                   # Terraform and provider constraints
│       ├── provider.tf                   # AWS provider configuration
│       ├── variables.tf                  # Typed input variables
│       ├── main.tf                       # EC2 and Security Group resources
│       ├── outputs.tf                    # Computed infrastructure outputs
│       └── terraform.tfvars.example      # Variable values template
├── helm/                                 # Kubernetes Application Packaging
│   └── gynecare/                         # Enterprise Helm Chart for GyneCare
│       ├── Chart.yaml                    # Chart metadata and semantic versioning
│       ├── values.yaml                   # Central parameterization schema
│       └── templates/                    # Go-templated Kubernetes manifests
│           ├── _helpers.tpl              # Reusable template helper definitions
│           ├── configmap.yaml            # Application configuration
│           ├── secret.yaml               # Database credentials
│           ├── pvc.yaml                  # Persistent storage claim for MongoDB
│           ├── deployment-frontend.yaml  # React Nginx Deployment with probes
│           ├── service-frontend.yaml     # NodePort Service (Port 30080)
│           ├── deployment-backend.yaml   # Express REST API Deployment
│           ├── service-backend.yaml      # ClusterIP Service (Port 5000)
│           ├── deployment-mongo.yaml     # MongoDB Stateful Deployment
│           ├── service-mongo.yaml        # Internal ClusterIP Service (Port 27017)
│           └── NOTES.txt                 # Post-installation instructions
├── kubernetes/                           # Raw Declarative Kubernetes Manifests
│   └── assignment-08/                    # Core Kubernetes Objects Specification
│       ├── namespace.yaml                # Isolated devops namespace
│       ├── pod.yaml                      # Atomic Pod manifest
│       ├── deployment.yaml               # 3-replica Deployment with rolling update
│       ├── service-clusterip.yaml        # Internal East-West service
│       ├── service-nodeport.yaml         # External NodePort service
│       ├── configmap.yaml                # Application environment config
│       ├── secret.example.yaml           # Secret template (Base64 lab credentials)
│       ├── persistentvolume.yaml         # HostPath PersistentVolume
│       └── persistentvolumeclaim.yaml    # Storage claim for database persistence
├── ansible/                              # Infrastructure Configuration Management
│   └── assignment-08/                    # Automated Nginx Web Server Case Study
│       ├── ansible.cfg                   # Engine configuration and transport tuning
│       ├── inventory.ini                 # INI inventory defining the 3-node target fleet
│       ├── install-nginx.yml             # Idempotent Nginx deployment playbook
│       ├── docker-compose.ansible-lab.yaml# 4-node containerized testbed (1 control + 3 targets)
│       ├── README.md                     # Execution and idempotency verification guide
│       └── files/
│           └── index.html                # Custom GyneCare portal landing page
├── docs/                                 # Comprehensive Academic Technical Documentation
│   ├── assignment-1/                     # MERN Baseline & System Architecture
│   ├── assignment-2/                     # AWS EC2 Cloud Deployment
│   ├── assignment-3/                     # Terraform Infrastructure as Code
│   ├── assignment-4/                     # Docker Application Containerization
│   ├── assignment-5/                     # Docker Compose Multi-Container Orchestration
│   ├── assignment-6/                     # Jenkins CI Integration with GitHub
│   ├── assignment-7/                     # Kubernetes Architecture and Helm
│   ├── assignment-8/                     # Kubernetes Objects & Ansible Automation
│   ├── assignment-9/                     # Container Orchestration & Helm Packaging
│   └── assignment-10/                    # Kubernetes Core Objects & Networking Services
└── evidence/                             # Verification Registers & Screenshot Evidence Guides
    ├── assignment-2/                     # AWS EC2 verification
    ├── assignment-3/                     # Terraform verification
    ├── assignment-4/                     # Docker build and container verification
    ├── assignment-5/                     # Compose stack verification
    ├── assignment-6/                     # Jenkins Freestyle & Pipeline verification
    ├── assignment-7/                     # Kubernetes & Helm lifecycle verification
    ├── assignment-8/                     # K8s objects & Ansible idempotency verification
    ├── assignment-9/                     # Helm compilation & release verification
    └── assignment-10/                    # K8s service routing & storage verification
```

---

## 8. DevOps Assignments Directory & Documentation Links

The table below provides direct links to the comprehensive academic documentation reports for all ten DevOps assignments:

| Assignment | Topic | Focus | Primary Implementation | Comprehensive Technical Report |
|---|---|---|---|---|
| **Assignment 1** | MERN Base Application | Three-tier architecture, React frontend, Express API, MongoDB seeding | `client/`, `server/` | [Assignment 1 Documentation](docs/assignment-1/assignment-1-documentation.md) |
| **Assignment 2** | Cloud Computing (AWS EC2) | Virtual machine lifecycle, VPC, Security Groups, SSH, manual hosting | `docs/assignment-2/` | [Assignment 2 Documentation](docs/assignment-2/assignment-2-documentation.md) |
| **Assignment 3** | Infrastructure as Code | HashiCorp Terraform automation for EC2 and Security Groups | `infrastructure/terraform/aws-ec2/` | [Assignment 3 Documentation](docs/assignment-3/assignment-3-documentation.md) |
| **Assignment 4** | Application Containerization | Alpine Dockerfile, `.dockerignore`, image build, container lifecycle, healthcheck | `Dockerfile`, `.dockerignore` | [Assignment 4 Documentation](docs/assignment-4/assignment-4-documentation.md) |
| **Assignment 5** | Multi-Container Orchestration | Docker Compose (`compose.yaml`), Nginx reverse proxy, named volumes, custom bridge | `compose.yaml`, `client/Dockerfile` | [Assignment 5 Documentation](docs/assignment-5/assignment-5-documentation.md) |
| **Assignment 6** | Jenkins CI Integration | Jenkins LTS in Docker, Freestyle SCM Job (`GitHub-Jenkins-Demo`), 5-Stage Declarative `Jenkinsfile` | `Jenkinsfile`, `docker/jenkins/` | [Assignment 6 Documentation](docs/assignment-6/assignment-6-documentation.md) |
| **Assignment 7** | Kubernetes & Helm | Control-plane & worker node architecture, multi-tier GyneCare Helm chart, release lifecycle | `helm/gynecare/` | [Assignment 7 Documentation](docs/assignment-7/assignment-7-documentation.md) |
| **Assignment 8** | Kubernetes Objects & Ansible | Core K8s primitives (Pod, Deployment, SVC, PV/PVC) + Ansible 3-node Nginx automation | `kubernetes/assignment-08/`, `ansible/assignment-08/` | [Assignment 8 Documentation](docs/assignment-8/assignment-8-documentation.md) |
| **Assignment 9** | Container Orchestration & Helm | Deep-dive Helm compilation mechanics (`Chart.yaml`, `values.yaml`, `templates/`), upgrades & rollbacks | `helm/gynecare/` | [Assignment 9 Documentation](docs/assignment-9/assignment-9-documentation.md) |
| **Assignment 10**| Kubernetes Objects & Services | Exhaustive service comparison (ClusterIP, NodePort, LoadBalancer, ExternalName), ingress & storage | `kubernetes/assignment-08/` | [Assignment 10 Documentation](docs/assignment-10/assignment-10-documentation.md) |

---

## 9. Quickstart: Running the DevOps Workflows

### 9.1 Docker Compose Full Stack (Assignment 5)
```bash
# Validate configuration and start all services
docker compose config
docker compose up -d --build

# Access endpoints:
# Web UI: http://localhost:3000
# Backend API: http://localhost:5000/api/health
```

### 9.2 Jenkins Continuous Integration Lab (Assignment 6)
```bash
# Start Jenkins LTS in containerized laboratory
docker compose -f docker/jenkins/compose.yaml up -d

# Retrieve initial administrative unlocking password
docker exec -it gynecare_jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins Dashboard at: http://localhost:8080
# Run Freestyle Job: GitHub-Jenkins-Demo
# Run Pipeline Job using root: Jenkinsfile
```

### 9.3 Kubernetes Application Deployment via Helm (Assignments 7 & 9)
```bash
# 1. Lint chart and test rendering
helm lint ./helm/gynecare
helm template gynecare ./helm/gynecare --namespace devops

# 2. Deploy application release
helm install gynecare ./helm/gynecare --namespace devops --create-namespace

# 3. View running workloads and services
kubectl get pods,services,pvc -n devops

# 4. Perform zero-downtime rolling update
helm upgrade gynecare ./helm/gynecare --set frontend.replicaCount=3 -n devops

# 5. Teardown release
helm uninstall gynecare -n devops
```

### 9.4 Kubernetes Core Objects Deployment (Assignments 8 & 10)
```bash
# Apply namespace and declarative manifests
kubectl apply -f kubernetes/assignment-08/namespace.yaml
kubectl apply -f kubernetes/assignment-08/

# Verify objects
kubectl get all,cm,secret,pv,pvc -n devops
```

### 9.5 Ansible Multi-Server Automation Lab (Assignment 8)
```bash
# 1. Start the 4-node containerized testbed (1 control node + 3 target nodes)
docker compose -f ansible/assignment-08/docker-compose.ansible-lab.yaml up -d

# 2. Test fleet connectivity
docker exec -it ansible_control_node ansible all -i inventory.ini -m ping

# 3. Execute automated Nginx deployment playbook
docker exec -it ansible_control_node ansible-playbook -i inventory.ini install-nginx.yml

# 4. Verify idempotency by executing a second time (changed=0)
docker exec -it ansible_control_node ansible-playbook -i inventory.ini install-nginx.yml

# 5. Verify HTTP service on mapped ports
curl http://localhost:8081
curl http://localhost:8082
curl http://localhost:8083
```

---

## 10. Important Ports Reference

| Port | Service | Host / Interface | Role |
|---|---|---|---|
| `3000` | Frontend Web UI (Compose) | `localhost:3000` | Nginx SPA HTTP web client |
| `5000` | Backend API (Compose) | `localhost:5000` | Express REST API & health probes |
| `27017`| MongoDB Database (Compose) | `localhost:27017` | Persistent document storage |
| `8080` | Jenkins Controller | `localhost:8080` | Jenkins web dashboard and automation engine |
| `50000`| Jenkins JNLP Inbound Port | `localhost:50000` | Dynamic build agent connection interface |
| `30080`| Kubernetes Frontend Service | `localhost:30080` | NodePort external access for React SPA |
| `8081` | Ansible Managed Node 1 | `localhost:8081` | Nginx web server on `nginx-01` |
| `8082` | Ansible Managed Node 2 | `localhost:8082` | Nginx web server on `nginx-02` |
| `8083` | Ansible Managed Node 3 | `localhost:8083` | Nginx web server on `nginx-03` |

---

## 11. Security & Compliance Principles
- **Strictly Zero Secrets in Git**: Passwords, tokens, SSH private keys, and AWS access keys are excluded from source control. Secret files are templatized as `.env.example` and `secret.example.yaml`.
- **Base64 vs Cryptographic Encryption**: Base64 encoding used in Kubernetes Secret manifests is documented as an obfuscation format, highlighting the architectural requirement for KMS envelope encryption and external secret managers in production.
- **Unprivileged Container Execution**: Docker containers run under dedicated unprivileged users (`gynecareuser`) to prevent container breakout exploits.
- **Network Micro-Segmentation**: MongoDB is shielded within isolated networks, accessible exclusively through internal ClusterIP or dedicated Docker bridge networks.
- **Transport Security & SSH Hardening**: Ansible configuration management operates over secure OpenSSH transport with strictly managed credentials.

---

## 12. Troubleshooting Guide

| Issue / Failure | Possible Root Cause | Resolution Command / Action |
|---|---|---|
| **Port 5000 or 3000 already in use** | Stray local process running on port | Adjust published ports in `.env` or run `netstat -ano \| findstr :5000` to terminate conflicting PID. |
| **Jenkins SCM checkout fails** | Git plugin missing or network timeout | Ensure Git and GitHub plugins are enabled in Jenkins; verify repository URL: `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git`. |
| **Helm template parsing failure** | YAML indentation or invalid variable tag | Execute `helm template --debug ./helm/gynecare` to pinpoint exact syntax error in `templates/`. |
| **Kubernetes Service has no endpoints** | Service selector mismatch with Pod labels | Inspect `kubectl describe svc <service-name> -n devops` and align `spec.selector` with `spec.template.metadata.labels`. |
| **Ansible SSH Ping Fails** | Container target SSH service offline | Run `docker compose -f ansible/assignment-08/docker-compose.ansible-lab.yaml ps` and verify ports 2201-2203 are bound. |

---

## 13. Conclusion
The GyneCare DevOps repository delivers a cohesive, industry-standard implementation spanning the entire software delivery and infrastructure management lifecycle. Through Assignments 1 to 10, the project demonstrates how modern engineering organizations transition monolithic codebases into containerized, automatically tested, declaratively provisioned, and resiliently orchestrated cloud-native systems.
