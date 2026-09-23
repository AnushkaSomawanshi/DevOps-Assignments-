# Setup

## Prerequisites

- Node.js 18 or newer
- npm or pnpm
- MongoDB reachable through `MONGO_URI`
- Git
- Docker for Assignment 4
- Terraform and AWS credentials only for Assignment 5 execution

## Install

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Configure

Copy `server/.env.example` to `server/.env` and provide local values. The root `.env.example` documents the same backend contract without secrets.

## Run

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

## Validate

```bash
curl http://localhost:5000/api/health
cd client && npm run build && npm run typecheck && npm run check
```

Full application execution remains `EXECUTION PENDING` until dependencies and MongoDB are available.
