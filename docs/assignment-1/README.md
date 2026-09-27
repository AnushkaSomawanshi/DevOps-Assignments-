# Assignment 1 — GyneCare Base Application & Architecture

## Overview
Assignment 1 establishes the baseline full-stack MERN application for the **GyneCare Hospital Management System**, serving as the foundational codebase for all subsequent DevOps tasks.

## Aim & Objective
To implement, organize, and document the baseline three-tier architecture of GyneCare:
- **Presentation Tier**: Modern React 19 SPA built with TypeScript, Vite, and Tailwind CSS.
- **Application Tier**: Express.js REST API service with modular controllers and health endpoints.
- **Data Tier**: MongoDB document database managed via Mongoose schemas with automated seeding.

## Technologies Used
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Router & Query
- **Backend**: Node.js 20, Express 4.21.2, CORS, Dotenv
- **Database**: MongoDB 7.0, Mongoose 8.9.5
- **Tooling**: Biome, PostCSS, Autoprefixer

## Important Files
- [`client/src/App.tsx`](../../client/src/App.tsx) — Main frontend application root
- [`client/vite.config.js`](../../client/vite.config.js) — Vite bundling and API proxy configuration
- [`server/server.js`](../../server/server.js) — Express server setup and route mounting
- [`server/config/db.js`](../../server/config/db.js) — MongoDB connection logic
- [`server/utils/seed.js`](../../server/utils/seed.js) — Automated initial data population
- [`.env.example`](../../.env.example) — Safe environment variable template

## Quick Execution
```bash
# Terminal 1 - Backend
cd server && npm install && npm run dev

# Terminal 2 - Frontend
cd client && npm install && npm run dev
```

## Detailed Documentation
For the full system architecture, API specifications, and local setup guide, refer to:
- [Assignment 1 Technical Documentation](assignment-1-documentation.md)
- [System Architecture](../../SYSTEM_ARCHITECTURE.md)
