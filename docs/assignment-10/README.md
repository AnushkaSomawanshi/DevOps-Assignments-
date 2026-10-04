# Assignment 10 — Kubernetes Core Objects and Networking Services

## Overview
Assignment 10 provides a focused examination of fundamental Kubernetes API objects and networking services, analyzing traffic routing, service discovery, decoupled configuration, and state persistence within the **GyneCare Hospital Management System**.

## Aim & Objectives
- Discover and implement core Kubernetes objects: Pod, Deployment, Service, Namespace, ConfigMap, Secret, PersistentVolume (PV), and PersistentVolumeClaim (PVC).
- Analyze the four Kubernetes Service types: ClusterIP, NodePort, LoadBalancer, and ExternalName.
- Understand traffic flows: external North-South ingress, internal East-West microservice routing, and database communication.
- Contrast local Kubernetes environment behavior (Docker Desktop) against production public cloud managed services (AWS EKS, GCP GKE, Azure AKS).

## Technologies Used
- **Container Orchestration**: Kubernetes (v1.36 client)
- **Networking**: `kube-proxy`, iptables, CoreDNS
- **Objects**: Pods, Deployments, Services, Namespaces, ConfigMaps, Secrets, PV/PVCs
- **Application**: GyneCare MERN Hospital Platform

## Important Files
- [`kubernetes/assignment-08/`](../../kubernetes/assignment-08/) — Shared production YAML manifests for Kubernetes objects
- [`helm/gynecare/templates/`](../../helm/gynecare/templates/) — Helm-templated equivalents for multi-tier deployment

## Quick Commands
```bash
# 1. Apply namespace and core objects
kubectl apply -f kubernetes/assignment-08/namespace.yaml
kubectl apply -f kubernetes/assignment-08/

# 2. Inspect running objects
kubectl get pods,deployments,services,configmaps,secrets,pvc -n devops

# 3. Inspect Service endpoints and routing
kubectl describe svc gynecare-clusterip-service -n devops
kubectl describe svc gynecare-nodeport-service -n devops

# 4. Verify storage binding
kubectl get pv,pvc -n devops
```

## Detailed Documentation
For complete component specifications, traffic flow diagrams, service comparison tables, and troubleshooting steps, refer to:
- [Assignment 10 Technical Documentation](assignment-10-documentation.md)
