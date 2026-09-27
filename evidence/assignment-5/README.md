# Assignment 5 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 5: Multi-Container Application with Docker Compose**.

## Required Evidence Checklist

1. **Compose Configuration Validation**: Output of `docker compose config` confirming valid YAML syntax and resolved environment defaults.
2. **Multi-Service Build**: Terminal output of `docker compose build` compiling both `gynecare-backend` and `gynecare-frontend`.
3. **Stack Startup**: Terminal output of `docker compose up -d` creating the network (`gynecare-network`), volume (`gynecare_mongodb_data`), and starting all containers.
4. **Service Status & Health**: Terminal output of `docker compose ps` displaying `gynecare-frontend`, `gynecare-backend`, and `gynecare-mongodb` with status `Up` and `healthy`.
5. **Frontend Web UI**: Browser or curl capture of `http://localhost:3000` rendering the GyneCare SPA.
6. **Backend Health Check**: HTTP response from `http://localhost:5000/api/health`.
7. **Database Persistence & Seeding**: HTTP response from `http://localhost:5000/api/doctors` demonstrating seeded records stored in and retrieved from MongoDB.
8. **Nginx Reverse Proxy**: Terminal response from `http://localhost:3000/api/health` routed through Nginx to backend.
9. **Named Volume & Network Verification**: Output of `docker volume ls --filter "name=gynecare"` and `docker network ls --filter "name=gynecare"`.
10. **Compose Logs**: Output of `docker compose logs backend` and `docker compose logs mongodb`.

For the detailed technical report, see [Assignment 5 Documentation](../../docs/assignment-5/assignment-5-documentation.md).
