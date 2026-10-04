# Assignment 6 — Jenkins Integration with GitHub

## Overview
Assignment 6 establishes Continuous Integration (CI) automation for the **GyneCare Hospital Management System** by connecting Jenkins to the official GitHub repository (`https://github.com/AnushkaSomawanshi/DevOps-Assignments-`).

## Aim & Objective
- Deploy and configure a containerized Jenkins LTS server.
- Configure Jenkins Git and GitHub plugins for automated Source Code Management (SCM).
- Implement a Freestyle Project (`GitHub-Jenkins-Demo`) for automatic branch `main` checkouts.
- Author a declarative [`Jenkinsfile`](../../Jenkinsfile) defining a production CI pipeline (Checkout -> Audit -> Dependencies -> Build & Typecheck -> Container Validation).

## Technologies Used
- **Automation Server**: Jenkins LTS (JDK 17)
- **Source Control**: Git 2.53, GitHub
- **Container Environment**: Docker Compose
- **Pipeline Language**: Declarative Jenkins Pipeline (Groovy DSL)
- **Application**: GyneCare MERN Platform

## Important Files
- [`Jenkinsfile`](../../Jenkinsfile) — Root declarative CI pipeline
- [`docker/jenkins/compose.yaml`](../../docker/jenkins/compose.yaml) — Jenkins container orchestration
- [`docker/jenkins/README.md`](../../docker/jenkins/README.md) — Jenkins local laboratory setup guide

## Core Commands & Workflow
```bash
# 1. Start Jenkins server
cd docker/jenkins
docker compose up -d

# 2. Retrieve initial admin password
docker compose logs jenkins | grep -A 2 "Please use the following password"

# 3. Access Jenkins Console
# http://localhost:8080
```

## Detailed Documentation
For complete step-by-step Freestyle job guides, pipeline stage explanations, webhook architectures, and troubleshooting matrices, refer to:
- [Assignment 6 Technical Documentation](assignment-6-documentation.md)
