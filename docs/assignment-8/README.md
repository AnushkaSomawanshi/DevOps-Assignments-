# Assignment 8 — Kubernetes Objects, Services and Ansible Case Study

## Overview
Assignment 8 investigates foundational Kubernetes API objects and networking services, complemented by a practical multi-server configuration management case study using **Ansible** to automate Nginx web server deployment across a 3-host target fleet.

## Aim & Objectives
- Implement and analyze core Kubernetes objects: Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer, ExternalName), Namespaces, ConfigMaps, Secrets, and Persistent Volumes.
- Understand the reconciliation control loop, dynamic Pod IP management, and stable service discovery via `kube-proxy`.
- Decouple application configuration and secrets using Kubernetes native primitives.
- Design and execute an automated Ansible infrastructure playbook (`install-nginx.yml`) targeting a fleet of managed Linux servers (`nginx-01`, `nginx-02`, `nginx-03`).
- Validate Ansible agentless execution, task idempotency, and state convergence.

## Technologies Used
- **Container Orchestration**: Kubernetes (v1.36 client)
- **Configuration Management**: Ansible Core (cytopia/ansible)
- **Transport**: OpenSSH, YAML playbooks, INI inventory
- **Managed Fleet**: 3 Ubuntu target instances via Docker Compose
- **Target Application**: Nginx HTTP server & GyneCare hospital landing portal

## Important Files
- [`kubernetes/assignment-08/`](../../kubernetes/assignment-08/) — Kubernetes YAML manifests for all core objects
- [`ansible/assignment-08/inventory.ini`](../../ansible/assignment-08/inventory.ini) — Ansible fleet inventory specification
- [`ansible/assignment-08/install-nginx.yml`](../../ansible/assignment-08/install-nginx.yml) — Production Ansible automation playbook
- [`ansible/assignment-08/docker-compose.ansible-lab.yaml`](../../ansible/assignment-08/docker-compose.ansible-lab.yaml) — Reproducible 4-node Dockerized Ansible testbed

## Quick Commands
```bash
# 1. Apply Kubernetes Objects
kubectl apply -f kubernetes/assignment-08/namespace.yaml
kubectl apply -f kubernetes/assignment-08/

# 2. Inspect Kubernetes Objects & Services
kubectl get pods,deployments,services,configmaps,secrets,pvc -n devops

# 3. Launch Ansible Multi-Node Lab
docker compose -f ansible/assignment-08/docker-compose.ansible-lab.yaml up -d

# 4. Test Ansible SSH Connectivity (Ping)
docker exec -it ansible_control_node ansible all -i inventory.ini -m ping

# 5. Execute Ansible Playbook (Idempotent Deployment)
docker exec -it ansible_control_node ansible-playbook -i inventory.ini install-nginx.yml
```

## Detailed Documentation
For detailed theoretical analyses, component breakdowns, comparison tables, and troubleshooting steps, refer to:
- [Assignment 8 Technical Documentation](assignment-8-documentation.md)
