# ==============================================================================
# GyneCare Hospital Management System - Dockerfile (Assignment 4)
# Production-ready container image for GyneCare Application / API Service
# ==============================================================================

# Step 1: Base Image
# Using lightweight, security-hardened Node.js LTS on Alpine Linux
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Install curl for container health checks
RUN apk add --no-cache curl

# Step 4: Security best practice - create dedicated non-root user and group
RUN addgroup -S gynecaregroup && adduser -S gynecareuser -G gynecaregroup

# Step 5: Configure runtime environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Step 6: Copy dependency manifests first to leverage Docker layer caching
COPY server/package*.json ./

# Step 7: Install production dependencies cleanly
RUN npm install --omit=dev --no-audit --no-fund

# Step 8: Copy backend application source code
COPY server/ ./

# Step 9: Set secure file ownership to the non-root user
RUN chown -R gynecareuser:gynecaregroup /app

# Step 10: Switch to non-privileged user
USER gynecareuser

# Step 11: Document exposed application port
EXPOSE 5000

# Step 12: Define health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Step 13: Container execution command
CMD ["node", "server.js"]
