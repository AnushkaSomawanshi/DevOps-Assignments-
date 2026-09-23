# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

The repository contains `client/` and `server/` directories.

**Frontend** (run from `client/`):

- **install**: `npm install`
- **typecheck**: `npm run typecheck`
- **lint/check**: `npm run check`
- **build**: `npm run build`

**Backend** (run from `server/`):

- **install**: `npm install`
- **development**: `npm run dev`
- **production-style start**: `npm start`

**Root shortcuts**:

- **build frontend**: `npm run build`
- **typecheck frontend**: `npm run typecheck`
- **check frontend**: `npm run check`
- **development frontend**: `npm run client`
- **development backend**: `npm run server`

The backend requires MongoDB and `server/.env` values based on
`server/.env.example`. The frontend development server proxies `/api`
requests to `http://127.0.0.1:5000`.

## Learnings

[No learnings yet]
