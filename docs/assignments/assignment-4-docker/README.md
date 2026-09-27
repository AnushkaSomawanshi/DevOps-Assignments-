# Assignment 4 — Dockerize GyneCare Application

> [!NOTE]
> The primary, comprehensive documentation for this assignment has been updated and organized in [docs/assignment-4/](../../assignment-4/).

## Summary
Assignment 4 containerizes the core **GyneCare Hospital Management System** application using an optimized Alpine Linux base image (`node:20-alpine`), multi-layer caching, non-root user execution (`gynecareuser`), integrated health checking, and validated lifecycle commands.

- **Primary Documentation**: [Assignment 4 Technical Documentation](../../assignment-4/assignment-4-documentation.md)
- **Quick Reference Guide**: [Assignment 4 README](../../assignment-4/README.md)
- **Container Definition**: [`Dockerfile`](../../../Dockerfile)
- **Build Exclusions**: [`.dockerignore`](../../../.dockerignore)

## Core Workflow
```bash
# Build image
docker build -t gynecare-app:v1 .

# Run container
docker run -d -p 5000:5000 --name gynecare-container gynecare-app:v1

# Verify health
curl http://localhost:5000/api/health
```
