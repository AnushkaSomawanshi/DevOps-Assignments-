# ==============================================================================
# GyneCare Hospital Management System - Frontend Dockerfile
# Multi-stage build: Stage 1 (Build with Node) -> Stage 2 (Serve with Nginx)
# ==============================================================================

# Stage 1: Build React/Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy client source code
COPY . ./

# Build production bundle
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration with SPA routing and API reverse-proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
