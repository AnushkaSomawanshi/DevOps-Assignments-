# Architecture

## Existing application

```mermaid
flowchart LR
  U[User] --> F[React + Vite frontend]
  F -->|/api requests| B[Express backend]
  B --> M[(MongoDB via Mongoose)]
  B --> G[Google Gemini API]
```

The development frontend proxies `/api` to the backend. The backend connects to MongoDB before listening and seeds baseline records.

## EC2 target architecture

```mermaid
flowchart LR
  U[User] --> SG[AWS security group]
  SG --> E[EC2 Linux host]
  E --> N[Node.js GyneCare backend]
  E --> S[Built frontend or frontend process]
  N --> M[(MongoDB external to EC2 unless proven otherwise)]
```

This is a target architecture. It becomes deployment evidence only after an actual EC2 deployment is performed.

## Docker architecture

```mermaid
flowchart TD
  C[Docker CLI] --> D[Docker Engine]
  D --> I[Image]
  I --> R[Container]
  R --> P[Python Flask application]
```

## Terraform architecture

```mermaid
flowchart TD
  T[Terraform configuration] --> P[AWS provider]
  P --> A[AWS API]
  A --> E[EC2]
  A --> S[Security group]
  A --> N[Network assumptions]
```

Terraform resources are configuration-ready until `plan` or `apply` is actually executed.
