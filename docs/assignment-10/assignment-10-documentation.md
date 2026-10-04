# Assignment 10 — Kubernetes Core Objects & Networking Services Deep-Dive

## 1. Assignment Title
**Assignment No. 10: Discover Kubernetes Objects and Networking Services**

## 2. Aim
To conduct a comprehensive exploration of fundamental Kubernetes API objects (Pods, Deployments, Services, Namespaces, ConfigMaps, Secrets, PersistentVolumes, and PersistentVolumeClaims), evaluate Kubernetes networking service types (ClusterIP, NodePort, LoadBalancer, and ExternalName), and deconstruct traffic routing flows within the GyneCare hospital management platform.

## 3. Objectives
- Deconstruct the lifecycle, internal data structures, and operational purpose of core Kubernetes primitives.
- Examine how the `kube-apiserver`, etcd, and individual object controllers manage state reconciliation.
- Investigate the four primary Kubernetes Service abstractions: ClusterIP, NodePort, LoadBalancer, and ExternalName.
- Analyze internal East-West and external North-South traffic routing mechanics, including `kube-proxy`, iptables/IPVS rules, and CoreDNS hostname resolution.
- Decouple application configuration and sensitive credentials using ConfigMaps and Secrets.
- Examine persistent volume provisioning, StorageClasses, and volume binding mechanics for stateful database storage.
- Document real-world operational trade-offs between local development clusters (Docker Desktop/Minikube) and enterprise public cloud Kubernetes environments (AWS EKS, GCP GKE, Azure AKS).

## 4. Learning Outcomes
- Ability to author and validate structured Kubernetes YAML manifests following industry best practices.
- Clear technical understanding of how Services select and load-balance traffic across dynamic Pod IP addresses.
- Mastery of networking models: when to employ ClusterIP vs NodePort vs LoadBalancer vs ExternalName.
- Expertise in managing application state using PersistentVolumes, PVCs, and storage reclaim policies.
- Practical troubleshooting skills for diagnosing networking issues, empty endpoints, DNS lookup failures, and container volume mounting errors.

---

## 5. Architectural Topology & Service Routing Flows

In the GyneCare hospital management system, multi-tier microservices interact through distinct Kubernetes Service types according to security boundaries and traffic direction.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        GYNECARE KUBERNETES NETWORKING TOPOLOGY                         │
│                                                                                        │
│   EXTERNAL TRAFFIC (North-South)                                                       │
│   ┌──────────────────────────────┐                                                     │
│   │ External Browser Client      │                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │                                                                     │
│                  │ HTTP Request (http://localhost:30080 or Cloud LB)                   │
│                  ▼                                                                     │
│   ┌──────────────────────────────┐                                                     │
│   │ gynecare-frontend-service    │                                                     │
│   │ Type: NodePort (Port 30080)  │                                                     │
│   │ Virtual IP: 10.96.80.10:80   │                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │ iptables / IPVS round-robin routing                                 │
│                  ▼                                                                     │
│   ┌──────────────────────────────┐                                                     │
│   │ Frontend Pods (Nginx/React)  │ (IPs: 10.244.0.21, 10.244.0.22)                     │
│   │ Selector: app=frontend       │                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │                                                                     │
│                  │ REST API Calls (http://gynecare-backend-service:5000)               │
│                  ▼                                                                     │
│   INTERNAL EAST-WEST TRAFFIC                                                           │
│   ┌──────────────────────────────┐                                                     │
│   │ gynecare-backend-service     │                                                     │
│   │ Type: ClusterIP (Internal)   │                                                     │
│   │ Virtual IP: 10.96.120.45:5000│                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │ kube-proxy load-balancing                                           │
│                  ▼                                                                     │
│   ┌──────────────────────────────┐                                                     │
│   │ Backend Pods (Node/Express)  │ (IPs: 10.244.0.31, 10.244.0.32)                     │
│   │ Selector: app=backend        │                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │                                                                     │
│                  │ MongoDB Protocol (mongodb://gynecare-mongo-service:27017)           │
│                  ▼                                                                     │
│   ┌──────────────────────────────┐                                                     │
│   │ gynecare-mongo-service       │                                                     │
│   │ Type: ClusterIP (Internal)   │                                                     │
│   │ Virtual IP: 10.96.200.15:27017                                                     │
│   └──────────────┬───────────────┘                                                     │
│                  │ Direct endpoint forwarding                                          │
│                  ▼                                                                     │
│   ┌──────────────────────────────┐          ┌───────────────────────────┐              │
│   │ MongoDB Pod (Stateful)       │─────────►│ PersistentVolumeClaim     │              │
│   │ Selector: app=mongodb        │ Mounts   │ (mongo-data-pvc -> 2Gi PV)│              │
│   └──────────────────────────────┘          └───────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Comprehensive Kubernetes Service Types Analysis

Kubernetes provides four distinct Service abstraction types to accommodate different application networking requirements:

| Dimension | ClusterIP | NodePort | LoadBalancer | ExternalName |
|---|---|---|---|---|
| **Primary Purpose** | Internal service discovery and East-West load-balancing. | Exposes service externally on each node's IP at a static port. | Provisions external cloud load balancer for North-South ingress. | Maps service DNS alias to an external CNAME record. |
| **Scope** | Intra-Cluster only. | Cluster-wide on all node host interfaces. | Internet / External VPC network. | DNS-level resolution (no proxying). |
| **Allocated Ports** | Port & TargetPort (e.g., 5000 -> 5000). | NodePort (30000–32767), Port, TargetPort. | Cloud LB Port, NodePort, TargetPort. | N/A (DNS redirect only). |
| **Traffic Handling** | Managed by `kube-proxy` via iptables or IPVS. | `kube-proxy` routes node interface traffic to target Pods. | Cloud provider LB forwards to NodePort, then to Pods. | CoreDNS returns external CNAME record to client. |
| **Typical Use Case** | Microservice APIs, internal databases, cache tiers. | Local development, debugging, bare-metal edge ingress. | Production web portals, public HTTP/HTTPS APIs. | Accessing external managed databases (e.g., AWS RDS, MongoDB Atlas). |
| **Local K8s Behavior** | Fully functional. | Fully functional (`localhost:<NodePort>`). | Remains in `<Pending>` without cloud controller or MetalLB. | Fully functional via CoreDNS. |
| **GyneCare Implementation** | `gynecare-backend-service`, `gynecare-mongo-service` | `gynecare-frontend-service` (Port 30080) | Production cloud alternative for frontend | External database integration example |

---

## 7. Deep-Dive Specification of Kubernetes Core Objects

### 7.1 Pod Object
The fundamental atomic building block of Kubernetes execution.
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gynecare-pod-demo
  namespace: devops
  labels:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: demo-pod
spec:
  restartPolicy: Always
  containers:
    - name: web-container
      image: nginx:1.25-alpine
      ports:
        - containerPort: 80
          name: http
      resources:
        requests:
          cpu: 50m
          memory: 64Mi
        limits:
          cpu: 100m
          memory: 128Mi
```
*Lifecycle phases*: `Pending` -> `Running` -> `Succeeded` / `Failed` (or `Unknown`).

---

### 7.2 Deployment Controller
Manages declarative Pod state, ReplicaSets, and rolling upgrades without downtime.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gynecare-frontend-deployment
  namespace: devops
  labels:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: frontend
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app.kubernetes.io/name: gynecare
      app.kubernetes.io/component: frontend
  template:
    metadata:
      labels:
        app.kubernetes.io/name: gynecare
        app.kubernetes.io/component: frontend
    spec:
      containers:
        - name: frontend
          image: gynecare-frontend:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 80
              name: http
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

---

### 7.3 Service Objects

#### 1. ClusterIP (Internal API & DB Communication)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-backend-service
  namespace: devops
  labels:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: backend
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: backend
  ports:
    - name: http
      port: 5000
      targetPort: 5000
```

#### 2. NodePort (External Access on Static Node Port)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-frontend-service
  namespace: devops
  labels:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: frontend
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: frontend
  ports:
    - name: http
      port: 80
      targetPort: 80
      nodePort: 30080
```

#### 3. LoadBalancer (Cloud-Native Ingress)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-loadbalancer-service
  namespace: devops
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: gynecare
    app.kubernetes.io/component: frontend
  ports:
    - name: http
      port: 80
      targetPort: 80
```
> **Environment Note**: In local Docker Desktop Kubernetes environments without a cloud controller or MetalLB, the `EXTERNAL-IP` field will remain in `<Pending>`. This is expected local behavior.

#### 4. ExternalName (External Service Alias)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-external-db
  namespace: devops
spec:
  type: ExternalName
  externalName: db.gynecare-hospital.org
```

---

### 7.4 Namespace Object
Provides virtual cluster isolation, RBAC boundary enforcement, and scoped resource quotas.
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: devops
  labels:
    environment: educational-production
    project: gynecare
```

---

### 7.5 ConfigMap & Secret Objects

#### ConfigMap (Environment Ingestion)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: gynecare-app-config
  namespace: devops
data:
  APP_ENV: "production"
  PORT: "5000"
  LOG_LEVEL: "info"
  CLIENT_ORIGIN: "http://localhost:30080"
```

#### Secret (Credential Protection)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gynecare-db-secret
  namespace: devops
type: Opaque
data:
  # Base64 encoded laboratory dummy values (admin / DevopsLabPass123!)
  username: YWRtaW4=
  password: RGV2b3BzTGFiUGFzczEyMyE=
```

---

### 7.6 PersistentVolume (PV) & PersistentVolumeClaim (PVC)
Separates storage infrastructure provisioning from application consumption.
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: gynecare-local-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  hostPath:
    path: "/tmp/gynecare-mongodb-data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gynecare-mongo-pvc
  namespace: devops
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  resources:
    requests:
      storage: 2Gi
```

---

## 8. Verification & Execution Status

| Object / Service | Verification Command | Expected Output | Status |
|---|---|---|---|
| **Namespace** | `kubectl get ns devops` | Status `Active` | Verified schema |
| **Pod** | `kubectl get pod gynecare-pod-demo -n devops` | Status `Running`, 1/1 Ready | Validated |
| **Deployment** | `kubectl get deployment gynecare-frontend-deployment -n devops` | 2/2 replicas available | Validated |
| **ClusterIP** | `kubectl get svc gynecare-backend-service -n devops` | Type `ClusterIP`, cluster IP assigned | Validated |
| **NodePort** | `kubectl get svc gynecare-frontend-service -n devops` | Type `NodePort`, port `80:30080/TCP` | Validated |
| **LoadBalancer** | `kubectl get svc gynecare-loadbalancer-service -n devops` | `<Pending>` locally, external IP in cloud | Validated |
| **ExternalName** | `kubectl describe svc gynecare-external-db -n devops` | `Endpoints: db.gynecare-hospital.org` | Validated |
| **ConfigMap** | `kubectl describe cm gynecare-app-config -n devops` | Key-value pairs displayed | Validated |
| **Secret** | `kubectl get secret gynecare-db-secret -n devops` | Type `Opaque`, 2 data entries | Validated |
| **PV / PVC** | `kubectl get pv,pvc -n devops` | Status `Bound` | Validated |

---

## 9. Comprehensive Troubleshooting Guide

| Issue / Failure | Root Cause | Diagnostic Command | Remediation Step |
|---|---|---|---|
| **Service Has No Endpoints** | Selector labels do not match Pod template labels | `kubectl get endpoints <service-name> -n devops` | Reconcile `spec.selector` in Service with `spec.template.metadata.labels` in Deployment. |
| **NodePort Inaccessible from Host** | Host firewall blocking port or incorrect node IP used | `curl -v http://localhost:30080` | Ensure port 30080 is within default range (`30000-32767`) and check local Docker port forwarding. |
| **LoadBalancer Stays in `<Pending>`** | Local cluster lacks cloud controller manager or MetalLB | `kubectl describe svc <lb-service> -n devops` | In local environments, rely on NodePort or port-forwarding; LoadBalancer requires cloud infrastructure. |
| **DNS Name Resolution Fails** | CoreDNS pod failure or incorrect FQDN syntax used | `kubectl get pods -n kube-system -l k8s-app=kube-dns` | Use fully qualified domain name: `<service>.<namespace>.svc.cluster.local`. |
| **PVC Pending Indefinitely** | No PV matches the storageClass, capacity, or accessMode | `kubectl describe pvc <pvc-name> -n devops` | Verify PV exists with identical `storageClassName` and capacity >= requested storage. |

---

## 10. Evidence & Screenshot Verification Mapping

To ensure complete academic traceability, capture the following exact technical screenshots:

| Reference | Evidence Item | Action / Command | Verification Objective |
|---|---|---|---|
| **Screenshot 1** | Pod Lifecycle Inspection | `kubectl get pods -n devops -o wide` | Verifies running Pod with assigned IP and node placement. |
| **Screenshot 2** | Deployment Scaling Status | `kubectl get deployments,replicasets -n devops` | Confirms replica set management and desired pod count. |
| **Screenshot 3** | ClusterIP Service & Endpoints | `kubectl describe svc gynecare-backend-service -n devops` | Shows internal cluster IP and dynamic endpoint assignment. |
| **Screenshot 4** | NodePort Service Verification | `kubectl get svc gynecare-frontend-service -n devops` | Displays static NodePort `30080` mapped to targetPort `80`. |
| **Screenshot 5** | LoadBalancer Pending Behavior | `kubectl get svc gynecare-loadbalancer-service -n devops` | Demonstrates expected `<Pending>` state in local Docker Desktop. |
| **Screenshot 6** | ExternalName Resolution | `kubectl describe svc gynecare-external-db -n devops` | Shows CNAME mapping to external hostname without selector. |
| **Screenshot 7** | ConfigMap & Secret Separation | `kubectl get configmaps,secrets -n devops` | Validates separation of plaintext configuration and credentials. |
| **Screenshot 8** | Persistent Storage Binding | `kubectl get pv,pvc -n devops` | Shows successful binding between PersistentVolume and PVC. |
| **Screenshot 9** | End-to-End Cluster Overview | `kubectl get all,cm,secret,pvc -n devops` | Provides a holistic architectural snapshot of all deployed resources. |

---

## 11. Requirement Traceability Matrix

| Requirement | Implementation Artifact | Verification Mechanism | Documentation Section |
|---|---|---|---|
| Pod Object | `kubernetes/assignment-08/pod.yaml` | `kubectl get pods` | Section 7.1 |
| Deployment Controller | `kubernetes/assignment-08/deployment.yaml` | `kubectl get deployments` | Section 7.2 |
| ClusterIP Service | `service-clusterip.yaml` | `kubectl describe svc` | Section 6 & 7.3 |
| NodePort Service | `service-nodeport.yaml` | `kubectl get svc` / browser test | Section 6 & 7.3 |
| LoadBalancer Service | Documentation & manifest | Local limitation analysis | Section 6 & 7.3 |
| ExternalName Service | Documentation & manifest | CoreDNS resolution inspection | Section 6 & 7.3 |
| Namespace Isolation | `kubernetes/assignment-08/namespace.yaml` | `kubectl get namespaces` | Section 7.4 |
| ConfigMap & Secret | `configmap.yaml`, `secret.example.yaml` | `kubectl describe cm,secret` | Section 7.5 |
| Storage (PV & PVC) | `persistentvolume.yaml`, `persistentvolumeclaim.yaml` | `kubectl get pv,pvc` | Section 7.6 |

---

## 12. Conclusion
Assignment 10 provides a thorough examination of Kubernetes core objects and networking architectures. By analyzing traffic flows across ClusterIP, NodePort, LoadBalancer, and ExternalName services, the exercise establishes a clear methodology for designing secure, resilient, and observable containerized applications for the GyneCare platform.
