# Assignment 7 — Kubernetes Architecture & Application Deployment Using Helm

## 1. Assignment Title
**Assignment No. 7: Explore Kubernetes Container Orchestration and Deploy an Application Using Helm**

## 2. Aim
To study Kubernetes container orchestration architecture, examine the internal operational mechanics of control-plane and worker-node components, design a modular Helm chart for the GyneCare MERN platform, and evaluate Helm packaging and release lifecycle operations.

## 3. Objectives
- Analyze the distributed architecture of Kubernetes clusters including control-plane and worker-node responsibilities.
- Understand the reconciliation control loop, desired state management, and self-healing mechanisms.
- Author a comprehensive Helm Chart for the GyneCare hospital management platform with parameter-driven values.
- Configure Kubernetes manifests for Frontend (React/Nginx), Backend (Node.js/Express API), MongoDB, persistent storage (PVC), ConfigMaps, and Secrets.
- Implement production-grade health probes (liveness and readiness) and compute resource constraints (requests/limits).
- Document and practice the core Helm lifecycle: `lint`, `template`, `install`, `status`, `upgrade`, and `uninstall`.

## 4. Learning Outcomes
- Understanding the roles of the Kubernetes API Server, etcd key-value store, kube-scheduler, and kube-controller-manager.
- Grasping worker node execution via `kubelet`, network routing via `kube-proxy`, and OCI container runtimes.
- Structuring enterprise Helm charts using semantic versioning, template helpers, and values separation.
- Managing persistent state in Kubernetes using PersistentVolumeClaims (PVCs) for stateful databases.
- Troubleshooting container lifecycle events (`CrashLoopBackOff`, `ImagePullBackOff`, probe failures, service routing).

## 5. Kubernetes Architecture Overview
Kubernetes is an open-source container orchestration platform designed to automate the deployment, scaling, networking, and lifecycle management of containerized applications across a cluster of nodes.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Kubernetes Control Plane                                  │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        kube-apiserver (REST Gateway)                           │   │
│   └───────┬───────────────────────────┬───────────────────────────┬────────────────┘   │
│           │                           │                           │                    │
│           ▼                           ▼                           ▼                    │
│   ┌───────────────┐           ┌───────────────┐           ┌───────────────┐            │
│   │     etcd      │           │ kube-scheduler│           │kube-controller│            │
│   │(Cluster State)│           │ (Node Binding)│           │    manager    │            │
│   └───────────────┘           └───────────────┘           └───────────────┘            │
└───────────────────────────────────────┬────────────────────────────────────────────────┘
                                        │ (Node Communication over TLS)
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│          Worker Node 1        │               │          Worker Node 2        │
│                               │               │                               │
│  ┌─────────────────────────┐  │               │  ┌─────────────────────────┐  │
│  │   kubelet (Agent)       │  │               │  │   kubelet (Agent)       │  │
│  └────────────┬────────────┘  │               │  └────────────┬────────────┘  │
│               │               │               │               │               │
│  ┌────────────▼────────────┐  │               │  ┌────────────▼────────────┐  │
│  │   kube-proxy (Network)  │  │               │  │   kube-proxy (Network)  │  │
│  └─────────────────────────┘  │               │  └─────────────────────────┘  │
│                               │               │                               │
│  ┌─────────────────────────┐  │               │  ┌─────────────────────────┐  │
│  │     Pods (Containers)   │  │               │  │     Pods (Containers)   │  │
│  │  • gynecare-frontend    │  │               │  │  • gynecare-backend     │  │
│  │  • gynecare-mongodb     │  │               │  │  • gynecare-backend     │  │
│  └─────────────────────────┘  │               │  └─────────────────────────┘  │
└───────────────────────────────┘               └───────────────────────────────┘
```

### Control Plane Components
1. **kube-apiserver**: The central management hub and entry point for all administrative, CLI (`kubectl`), and internal cluster communications. It validates and configures data for Pods, Services, and ReplicationControllers.
2. **etcd**: A consistent, highly available distributed key-value store serving as the definitive single source of truth for all cluster configuration and real-time state data.
3. **kube-scheduler**: Watches for newly created Pods with no assigned node and selects the optimal worker node based on resource constraints, affinity specifications, and hardware availability.
4. **kube-controller-manager**: Runs core controller reconciliation loops (Node Lifecycle Controller, ReplicaSet Controller, EndpointSlice Controller, ServiceAccount Controller) to reconcile the current state with the declared desired state.

### Worker Node Components
1. **kubelet**: The primary node agent that registers the node with the API server, monitors PodSpecs submitted by the control plane, and instructs the container runtime to launch or stop containers.
2. **kube-proxy**: Maintains network packet-filtering rules (using iptables or IPVS) on each node to implement service abstractions and load balance traffic across Pod endpoints.
3. **Container Runtime**: Software responsible for running containers (e.g., containerd, CRI-O) adhering to the Kubernetes Container Runtime Interface (CRI).

## 6. Desired State, Reconciliation, and Self-Healing
Kubernetes operates on a declarative **desired-state** model:
- An operator defines what resources should exist (e.g., `replicas: 2`).
- The controller manager continuously compares the *actual state* (reported by kubelets) against the *desired state* (stored in etcd).
- If a container crashes, the kubelet restarts it. If an entire node fails, the controller manager reschedules its Pods onto healthy nodes.

## 7. Helm Architecture & Package Management
Helm is the package manager for Kubernetes. It addresses the complexity of managing raw Kubernetes YAML files across multiple environments (development, staging, production) by introducing **Charts**—reusable, parameterized package templates.

```
┌────────────────────────────────────────────────────────┐
│                      Helm Client                       │
│                                                        │
│  • Chart.yaml (Metadata)                               │
│  • values.yaml (Configurable variables)                │
│  • templates/ (Parameterized Kubernetes manifests)     │
└───────────────────────────┬────────────────────────────┘
                            │ helm install / upgrade
                            │ (Local Go Templating Engine)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Rendered Kubernetes Manifests              │
│             (ConfigMap, Secrets, Deployments, SVGs)    │
└───────────────────────────┬────────────────────────────┘
                            │ Submits to Kubernetes API Server
                            ▼
┌────────────────────────────────────────────────────────┐
│               Kubernetes Cluster Engine                │
│           (Tracks Helm Release in Secrets/etcd)        │
└────────────────────────────────────────────────────────┘
```

- **Tiller-less Architecture**: In Helm v3, Tiller was completely removed. Helm communicates directly with the Kubernetes API server using the user's local `kubeconfig` authentication context.
- **Releases**: An installed instance of a chart within a cluster.
- **Release Tracking**: Helm stores release history directly inside Kubernetes cluster secrets.

## 8. GyneCare Helm Chart Structure
The chart resides in [`helm/gynecare/`](../../helm/gynecare/):

```text
helm/gynecare/
├── Chart.yaml                  # Chart metadata (name, version, appVersion)
├── values.yaml                 # Centralized configuration parameters
└── templates/                  # Parameterized Kubernetes templates
    ├── _helpers.tpl            # Reusable naming and label template macros
    ├── configmap.yaml          # Non-sensitive runtime variables (PORT, MONGO_URI)
    ├── secret.yaml             # Laboratory secrets template (GEMINI_API_KEY)
    ├── pvc.yaml                # PersistentVolumeClaim for MongoDB data storage
    ├── deployment-mongo.yaml   # MongoDB pod template and volume mounts
    ├── service-mongo.yaml      # Internal ClusterIP service for database access
    ├── deployment-backend.yaml # GyneCare Express API deployment with probes
    ├── service-backend.yaml    # Internal ClusterIP service for API routing
    ├── deployment-frontend.yaml# React SPA served via Nginx with probes
    ├── service-frontend.yaml   # NodePort service exposing web interface
    └── NOTES.txt               # Post-installation instructions displayed to user
```

## 9. Key Chart Templates & Implementation

### 1. Chart Metadata (`Chart.yaml`)
```yaml
apiVersion: v2
name: gynecare
description: Enterprise Helm Chart for GyneCare Hospital Management System (Frontend, Backend, MongoDB)
type: application
version: 1.0.0
appVersion: "1.0.0"
```

### 2. Configurable Values (`values.yaml`)
Enables deployment customization without altering underlying Kubernetes manifests:
```yaml
frontend:
  replicaCount: 2
  image:
    repository: gynecare-frontend
    tag: latest
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 80
    nodePort: 30080

backend:
  replicaCount: 2
  image:
    repository: gynecare-backend
    tag: latest
  service:
    type: ClusterIP
    port: 5000

mongodb:
  image:
    repository: mongo
    tag: "7.0"
  persistence:
    enabled: true
    size: 5Gi
```

### 3. Backend Deployment Template with Probes
From [`templates/deployment-backend.yaml`](../../helm/gynecare/templates/deployment-backend.yaml):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "gynecare.fullname" . }}-backend
spec:
  replicas: {{ .Values.backend.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "gynecare.name" . }}
      app.kubernetes.io/component: backend
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ include "gynecare.name" . }}
        app.kubernetes.io/component: backend
    spec:
      containers:
        - name: backend
          image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}"
          ports:
            - containerPort: {{ .Values.backend.service.port }}
              name: http-api
          envFrom:
            - configMapRef:
                name: {{ include "gynecare.fullname" . }}-config
            - secretRef:
                name: {{ include "gynecare.fullname" . }}-secret
          livenessProbe:
            httpGet:
              path: {{ .Values.backend.probes.liveness.path }}
              port: http-api
            initialDelaySeconds: 15
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: {{ .Values.backend.probes.readiness.path }}
              port: http-api
            initialDelaySeconds: 5
            periodSeconds: 10
```

## 10. Operational Probes & Resource Management
1. **Liveness Probes**: Verify that the containerized process is alive. If `GET /api/health` fails repeatedly, kubelet kills and restarts the container.
2. **Readiness Probes**: Determine whether the application is ready to accept incoming user traffic. Traffic is withheld from new Pods until they report ready, enabling zero-downtime rolling updates.
3. **Resource Requests & Limits**: Prevent noisy neighbors from monopolizing cluster memory and CPU, ensuring predictable scheduling.

## 11. Helm Command Workflow

```bash
# 1. Lint the chart for syntax and formatting errors
helm lint ./helm/gynecare

# 2. Render templates locally to inspect generated YAML
helm template gynecare ./helm/gynecare

# 3. Dry-run installation to validate against the API server
helm install gynecare ./helm/gynecare --dry-run

# 4. Install chart into target namespace
helm install gynecare ./helm/gynecare --namespace devops --create-namespace

# 5. List active Helm releases
helm list -n devops

# 6. Check release status and deployed resources
helm status gynecare -n devops

# 7. Upgrade deployment (e.g., increase replicas or update image tag)
helm upgrade gynecare ./helm/gynecare --set frontend.replicaCount=3 -n devops

# 8. Uninstall release
helm uninstall gynecare -n devops
```

## 12. Troubleshooting Guide

| Problem | Root Cause | Solution |
|---|---|---|
| `ImagePullBackOff` | Image does not exist in registry or local node | Pre-load images via Docker Desktop or set `imagePullPolicy: IfNotPresent` |
| `CrashLoopBackOff` | Application crashes immediately on boot | Inspect logs via `kubectl logs <pod-name>` to check database connection or missing env vars |
| `PersistentVolumeClaim Pending` | No StorageClass available to fulfill claim | Configure a default StorageClass or set `persistence.enabled: false` for testing |
| Backend cannot resolve MongoDB | DNS service name mismatch | Ensure backend `MONGO_URI` references `<release>-mongo:<port>` |
| `Service has no endpoints` | Pod selector does not match Deployment labels | Compare `spec.selector` in Service with `spec.template.metadata.labels` in Deployment |

## 13. Security Considerations
- **ConfigMap vs. Secret**: Non-sensitive settings (like `PORT: 5000`) reside in ConfigMaps, whereas tokens reside in Secrets.
- **Base64 vs Encryption**: Kubernetes secrets are base64-encoded by default; in enterprise clusters, they must be backed by KMS encryption at rest.
- **Least Privilege**: The GyneCare container images are pre-configured with non-root users (`gynecareuser`).

## 14. DevOps Relevance
Packaging GyneCare into a Helm chart automates Kubernetes operations:
- Enables environment portability: The same chart deploys to minikube, Docker Desktop, or cloud managed Kubernetes (AWS EKS, GKE, AKS) by varying `values.yaml`.
- Atomic upgrades and rollbacks prevent partial deployment failures.
- Versioned releases provide full traceability in GitOps pipelines.

## 15. Results
- Created production-ready Helm chart `gynecare` in `helm/gynecare/`.
- Configured modular templates for frontend, backend, MongoDB, networking, storage, and secrets.
- Verified template syntax and parameter mapping.
- Documented full lifecycle execution procedures.

## 16. Limitations & Environment Status
- **Cluster Connectivity**: Docker Desktop Kubernetes is currently disabled on the local workstation. Commands requiring active cluster API response (`kubectl get nodes`, `helm install`) require enabling Kubernetes in Docker Desktop settings before execution.

## 17. Evidence / Screenshot Guide

| Item | Title | Purpose | Command / Action | What It Proves |
|---|---|---|---|---|
| **Screenshot 1** | Cluster Readiness | Verify Kubernetes control plane | `kubectl cluster-info` & `kubectl get nodes` | Confirms healthy cluster |
| **Screenshot 2** | Helm Chart Anatomy | Show chart directory structure | `tree helm/gynecare` or `dir /s helm\gynecare` | Confirms complete Helm chart layout |
| **Screenshot 3** | Helm Template Output | Show template compilation | `helm template gynecare ./helm/gynecare` | Proves YAML compiles with values |
| **Screenshot 4** | Helm Installation | Deploy application release | `helm install gynecare ./helm/gynecare` | Confirms release created |
| **Screenshot 5** | Pod & Service Status | View running cluster resources | `kubectl get pods,svc,pvc -n devops` | Proves all Pods running and Services exposed |
| **Screenshot 6** | Helm Upgrade & Teardown | Release lifecycle verification | `helm upgrade` and `helm uninstall` | Confirms rollback & clean teardown |

## 18. Requirement Traceability Matrix

| Requirement | Implementation Artifact | Verification Command | Status |
|---|---|---|---|
| Architecture Documentation | Section 5 of this report | Conceptual verification | Documented |
| Helm Chart Creation | `helm/gynecare/Chart.yaml` | `helm lint ./helm/gynecare` | Implemented |
| Configurable Values | `helm/gynecare/values.yaml` | Template parameter substitution | Implemented |
| Multi-Tier Templates | `helm/gynecare/templates/` | `helm template gynecare ./helm/gynecare` | Implemented |
| Probes & Resources | `deployment-backend.yaml` | Liveness/Readiness probes declared | Implemented |
| Persistent Storage | `pvc.yaml` | 5Gi volume claim for MongoDB | Implemented |

## 19. Conclusion
Assignment 7 elevates GyneCare from local container orchestration (Docker Compose) to enterprise-grade container orchestration with Kubernetes and Helm. By packaging the frontend, backend, database, and storage into a unified Helm chart, deployments become standardized, declarative, and production-ready.
