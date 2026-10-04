# Assignment 7 — Kubernetes Architecture and Helm

## Overview
Assignment 7 explores Kubernetes container orchestration architecture and establishes a unified Helm chart for packaging and deploying the **GyneCare Hospital Management System**.

## Aim & Objective
- Study Kubernetes distributed architecture: Control Plane (API Server, etcd, Scheduler, Controller Manager) and Worker Nodes (kubelet, kube-proxy, runtime).
- Design a modular, values-driven Helm chart for the GyneCare MERN platform in [`helm/gynecare/`](../../helm/gynecare/).
- Parameterize deployments, services, storage, and networking across Frontend, Backend, and MongoDB tiers.
- Implement production-grade health probes (liveness, readiness) and resource constraints.
- Practice Helm packaging operations: `lint`, `template`, `install`, `upgrade`, and `uninstall`.

## Technologies Used
- **Orchestration**: Kubernetes (v1.36 client)
- **Package Manager**: Helm v3
- **Workloads**: Deployments, Pods, Services, PVCs, ConfigMaps, Secrets
- **Application**: GyneCare MERN Hospital Platform

## Important Files
- [`helm/gynecare/Chart.yaml`](../../helm/gynecare/Chart.yaml) — Chart metadata declaration
- [`helm/gynecare/values.yaml`](../../helm/gynecare/values.yaml) — Central configuration values
- [`helm/gynecare/templates/`](../../helm/gynecare/templates/) — Parameterized Kubernetes templates

## Quick Commands
```bash
# 1. Inspect rendered Kubernetes YAML without deploying
helm template gynecare ./helm/gynecare

# 2. Deploy application release
helm install gynecare ./helm/gynecare --namespace devops --create-namespace

# 3. View running pods and services
kubectl get pods,svc,pvc -n devops

# 4. Perform rolling upgrade
helm upgrade gynecare ./helm/gynecare --set frontend.replicaCount=3 -n devops

# 5. Teardown release
helm uninstall gynecare -n devops
```

## Detailed Documentation
For complete architectural diagrams, control-plane component breakdowns, template analyses, and troubleshooting tables, refer to:
- [Assignment 7 Technical Documentation](assignment-7-documentation.md)
