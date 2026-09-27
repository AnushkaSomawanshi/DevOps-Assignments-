# Assignment 4 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 4: Dockerize GyneCare Application**.

## Required Evidence Checklist

1. **Docker Engine Verification**: Output of `docker --version` and `docker info` demonstrating Docker Desktop / Engine availability.
2. **Docker Build Process**: Terminal capture of `docker build -t gynecare-app:v1 .` demonstrating successful multi-layer compilation.
3. **Docker Image Listing**: Output of `docker images gynecare-app:v1` showing image ID, disk usage, and size.
4. **Active Container Execution**: Output of `docker ps` showing `gynecare-container` running with port mapping `5000:5000`.
5. **Application Responsiveness**: HTTP response from `http://localhost:5000/` and `http://localhost:5000/api/health`.
6. **Container Logs**: Output of `docker logs gynecare-container` showing application initialization.
7. **Container Lifecycle**: Terminal output demonstrating `docker exec`, `docker stop`, `docker start`, and `docker rm`.

For the detailed technical report, see [Assignment 4 Documentation](../../docs/assignment-4/assignment-4-documentation.md).
