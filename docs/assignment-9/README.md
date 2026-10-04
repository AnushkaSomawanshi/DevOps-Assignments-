# Assignment 9 — Kubernetes Container Orchestration and Helm Packaging Mechanics

## Overview
Assignment 9 provides a dedicated, in-depth exploration of container orchestration principles in Kubernetes and examines the inner workings of **Helm**, the Kubernetes package manager.

## Aim & Objectives
- Analyze the operational mechanics of container orchestration (scheduling, health monitoring, desired state reconciliation, and self-healing).
- Deconstruct the key components of a Helm chart: `Chart.yaml`, `values.yaml`, and the `templates/` directory.
- Understand the template compilation pipeline using the Go `text/template` engine and Sprig helper functions.
- Master the full Helm release lifecycle: `lint`, `template`, `install`, `status`, `history`, `upgrade`, `rollback`, and `uninstall`.
- Evaluate how release states are tracked using revision-specific Kubernetes Secrets.

## Technologies Used
- **Orchestrator**: Kubernetes (v1.36 client)
- **Package Manager**: Helm v3
- **Template Engine**: Go `text/template` + Sprig
- **Application**: GyneCare MERN Hospital Platform ([`helm/gynecare/`](../../helm/gynecare/))

## Important Files
- [`helm/gynecare/Chart.yaml`](../../helm/gynecare/Chart.yaml) — Package metadata and semantic versioning
- [`helm/gynecare/values.yaml`](../../helm/gynecare/values.yaml) — Central parameterization schema
- [`helm/gynecare/templates/`](../../helm/gynecare/templates/) — Reusable Kubernetes templates & helpers

## Quick Commands
```bash
# 1. Validate chart structure and syntax
helm lint ./helm/gynecare

# 2. Render templates locally without deploying
helm template gynecare ./helm/gynecare --namespace devops

# 3. Deploy application release
helm install gynecare ./helm/gynecare --namespace devops --create-namespace

# 4. View release status and running resources
helm status gynecare -n devops
kubectl get pods,svc,pvc -n devops

# 5. Perform zero-downtime rolling upgrade
helm upgrade gynecare ./helm/gynecare --set frontend.replicaCount=3 -n devops

# 6. Audit release history
helm history gynecare -n devops

# 7. Teardown release
helm uninstall gynecare -n devops
```

## Detailed Documentation
For the full technical report, compilation pipeline diagrams, template analysis, and troubleshooting steps, refer to:
- [Assignment 9 Technical Documentation](assignment-9-documentation.md)
