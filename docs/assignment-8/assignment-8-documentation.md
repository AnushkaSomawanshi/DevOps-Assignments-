# Assignment 8 — Kubernetes Objects, Networking Services & Ansible Automation

## 1. Assignment Title
**Assignment No. 8: Explore Kubernetes Objects and Services and Demonstrate Configuration Management Using Ansible**

## 2. Aim
To study and implement foundational Kubernetes API objects (Pods, Deployments, Services, Namespaces, ConfigMaps, Secrets, PersistentVolumes, and PersistentVolumeClaims), evaluate service networking models (ClusterIP, NodePort, LoadBalancer, ExternalName), and demonstrate automated multi-host infrastructure configuration management using Ansible.

## 3. Objectives
- Examine the operational semantics, YAML schemas, and reconciliation loops of Kubernetes core primitives.
- Deploy and verify Pods, multi-replica Deployments, and container lifecycle controls.
- Implement and compare Kubernetes networking services for internal East-West and external North-South traffic routing.
- Decouple application configuration and secrets using ConfigMaps and Kubernetes Secrets.
- Configure persistent state storage via PersistentVolumes (PV) and PersistentVolumeClaims (PVC).
- Implement an automated Ansible configuration-management case study orchestrating Nginx web servers across a 3-node target fleet.
- Validate Ansible agentless execution, SSH key-based transport, task idempotency, and configuration drift prevention.

## 4. Learning Outcomes
- Ability to author production-ready Kubernetes YAML manifests for workloads, configuration, networking, and storage.
- Mastery of Kubernetes Service abstraction, endpoint controllers, kube-proxy iptables/IPVS modes, and DNS service discovery.
- Comprehension of stateful data persistence, access modes (`ReadWriteOnce`, `ReadOnlyMany`, `ReadWriteMany`), and storage class bindings.
- Proficiency in Ansible automation, YAML playbook design, Jinja2 templating, inventory management, and module usage (`apt`, `service`, `copy`, `debug`).
- Understanding the practical differences between imperative management (`kubectl run`) and declarative Infrastructure as Code (GitOps/Ansible/K8s).

---

## 5. Architectural Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PART A: KUBERNETES OBJECT HIERARCHY                             │
│                                                                                        │
│   Namespace: devops (gynecare)                                                         │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                Deployment                                      │   │
│   │   spec.replicas: 3                                                             │   │
│   │   spec.selector.matchLabels: app=gynecare-workload                             │   │
│   │   ┌───────────────────────┬───────────────────────┬────────────────────────┐   │   │
│   │   │         Pod 1         │         Pod 2         │         Pod 3          │   │   │
│   │   │  IP: 10.244.0.15      │  IP: 10.244.0.16      │  IP: 10.244.0.17       │   │   │
│   │   │  Container: nginx/app │  Container: nginx/app │  Container: nginx/app  │   │   │
│   │   └───────────▲───────────┴───────────▲───────────┴───────────▲────────────┘   │   │
│   └───────────────┼───────────────────────┼───────────────────────┼────────────────┘   │
│                   │                       │                       │                    │
│   ┌───────────────┴───────────────────────┴───────────────────────┴────────────────┐   │
│   │                        Kubernetes Service (ClusterIP / NodePort)               │   │
│   │   Virtual IP: 10.96.120.45:80 -> Selector: app=gynecare-workload               │   │
│   └───────────────────────────────────────▲────────────────────────────────────────┘   │
│                                           │                                            │
│   Mounted Injected Resources:             │ Storage Binding:                           │
│   • ConfigMap (app-config) ───────────────┤ • PVC (mongo-data-pvc)                     │
│   • Secret (db-secret) ───────────────────┘ • PV (Local / CSI StorageClass)            │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PART B: ANSIBLE AUTOMATION LAB TOPOLOGY                         │
│                                                                                        │
│                    ┌──────────────────────────────────────┐                            │
│                    │         Ansible Control Node         │                            │
│                    │          (cytopia/ansible)           │                            │
│                    │         IP: 172.28.0.10:22           │                            │
│                    └──────────────────┬───────────────────┘                            │
│                                       │                                                │
│                 OpenSSH / Key Auth    │ (Subnet: 172.28.0.0/16)                        │
│         ┌─────────────────────────────┼─────────────────────────────┐                  │
│         ▼                             ▼                             ▼                  │
│  ┌──────────────┐              ┌──────────────┐              ┌──────────────┐          │
│  │   nginx-01   │              │   nginx-02   │              │   nginx-03   │          │
│  │ 172.28.0.11  │              │ 172.28.0.12  │              │ 172.28.0.13  │          │
│  │  Port: 8081  │              │  Port: 8082  │              │  Port: 8083  │          │
│  │  State: HTTP │              │  State: HTTP │              │  State: HTTP │          │
│  └──────────────┘              └──────────────┘              └──────────────┘          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Part A: Kubernetes Core Objects Deep-Dive

### 6.1 Pod Primitive (`pod.yaml`)
A **Pod** is the atomic execution unit in Kubernetes. It encapsulates one or more co-located, co-managed containers sharing:
1. **Network Namespace**: Shared localhost interface and unique Pod IP address.
2. **IPC Namespace**: Inter-process communication across shared memory.
3. **Storage Volumes**: Volumes mounted identically across all containers in the Pod.

#### Explanation
While individual Pods can be deployed directly, they are ephemeral. In production, bare Pods are never managed manually because if a node crashes, unmanaged Pods are deleted and never rescheduled. Controllers (such as Deployments) provide self-healing and replication.

#### Manifest Implementation
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gynecare-core-pod
  namespace: devops
  labels:
    app: gynecare-workload
    component: standalone-demo
spec:
  containers:
    - name: nginx-server
      image: nginx:1.25-alpine
      ports:
        - containerPort: 80
          name: http
      resources:
        requests:
          memory: "64Mi"
          cpu: "50m"
        limits:
          memory: "128Mi"
          cpu: "100m"
```

#### Verification Commands
```bash
kubectl apply -f kubernetes/assignment-08/namespace.yaml
kubectl apply -f kubernetes/assignment-08/pod.yaml
kubectl get pods -n devops -o wide
kubectl describe pod gynecare-core-pod -n devops
kubectl logs gynecare-core-pod -n devops
```

---

### 6.2 Deployment Controller (`deployment.yaml`)
A **Deployment** provides declarative updates for Pods and ReplicaSets. It manages desired state, rollout strategies (RollingUpdate vs Recreate), scaling, and zero-downtime canary updates.

#### Manifest Implementation
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gynecare-workload-deployment
  namespace: devops
  labels:
    app: gynecare-workload
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gynecare-workload
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: gynecare-workload
    spec:
      containers:
        - name: app-workload
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef:
                name: gynecare-app-config
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: gynecare-db-secret
                  key: password
```

#### Scaling & Rollout Verification
```bash
kubectl apply -f kubernetes/assignment-08/deployment.yaml
kubectl get deployments -n devops
kubectl get replicasets -n devops
kubectl scale deployment gynecare-workload-deployment --replicas=5 -n devops
kubectl rollout status deployment/gynecare-workload-deployment -n devops
kubectl scale deployment gynecare-workload-deployment --replicas=3 -n devops
```

---

### 6.3 Kubernetes Networking Services (`ClusterIP` & `NodePort`)

Kubernetes Pods are assigned dynamic internal IP addresses upon creation. Because Pods are mortal, their IPs change continuously. The **Service** abstraction provides a stable virtual IP address (ClusterIP) and stable DNS name, automatically load-balancing across all backing Pods that match the service selector.

| Service Type | Scope | Access Mechanism | Local Behavior | Production Cloud Behavior |
|---|---|---|---|---|
| **ClusterIP** | Intra-Cluster | Accessible strictly inside the cluster via `Service-IP:Port` or DNS. | Default type. Managed via `kube-proxy` iptables. | Standard East-West microservice communication. |
| **NodePort** | Cluster Nodes | Exposes a static port on each worker node (`30000-32767`). | Accessible at `localhost:<NodePort>`. | Fallback mechanism or internal direct ingress routing. |
| **LoadBalancer** | External | Provisions cloud provider load balancer (AWS NLB/ALB, GCP LB). | Stays in `<Pending>` without MetalLB or cloud controller. | Standard North-South ingress for public traffic. |
| **ExternalName** | External DNS | Maps service DNS to external CNAME record (no proxying). | Resolves external hostname via CoreDNS. | Clean routing to external RDS or third-party APIs. |

#### ClusterIP Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-clusterip-service
  namespace: devops
spec:
  type: ClusterIP
  selector:
    app: gynecare-workload
  ports:
    - name: http
      port: 80
      targetPort: 80
```

#### NodePort Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gynecare-nodeport-service
  namespace: devops
spec:
  type: NodePort
  selector:
    app: gynecare-workload
  ports:
    - name: http
      port: 80
      targetPort: 80
      nodePort: 30080
```

---

### 6.4 Configuration & Secret Decoupling

#### ConfigMap (`configmap.yaml`)
Decouples non-confidential environment configuration from application container binaries.
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: gynecare-app-config
  namespace: devops
data:
  APP_ENV: "staging"
  LOG_LEVEL: "info"
  PORT: "5000"
  API_PREFIX: "/api/v1"
```

#### Secret (`secret.example.yaml`)
Stores sensitive credentials. Values are Base64-encoded in the manifest.
> **Security Notice**: Base64 encoding is an obfuscation mechanism, not cryptographic encryption. Production deployments require encryption-at-rest via KMS and integration with external vaults (HashiCorp Vault, AWS Secrets Manager).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gynecare-db-secret
  namespace: devops
type: Opaque
data:
  # Laboratory Dummy Credentials: admin / DevopsLabPass123!
  username: YWRtaW4=
  password: RGV2b3BzTGFiUGFzczEyMyE=
```

---

### 6.5 Persistent Storage Architecture

Stateful databases (like MongoDB) require persistence across Pod restarts and rescheduling events.
1. **PersistentVolume (PV)**: Cluster-level storage resource provisioned statically by an admin or dynamically by a StorageClass.
2. **PersistentVolumeClaim (PVC)**: Developer request for storage meeting specific capacity and access mode criteria.
3. **Pod Mounting**: The PVC is referenced by the Pod specification and mounted to the target container path (`/data/db`).

```
┌─────────────────────────────────┐
│     PersistentVolume (PV)       │
│  Capacity: 5Gi, Local HostPath  │
└────────────────┬────────────────┘
                 │ Bound by Kubernetes Storage Controller
┌────────────────▼────────────────┐
│   PersistentVolumeClaim (PVC)   │
│  Capacity Requested: 2Gi        │
└────────────────┬────────────────┘
                 │ Mounted into Pod
┌────────────────▼────────────────┐
│       MongoDB Container         │
│   VolumeMount: /data/db         │
└─────────────────────────────────┘
```

#### PersistentVolume & Claim Manifests
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: gynecare-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: "/tmp/gynecare-storage"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gynecare-pvc
  namespace: devops
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  resources:
    requests:
      storage: 2Gi
```

---

## 7. Part B: Ansible Multi-Server Configuration Management

### 7.1 Problem Statement & Solution Architecture
Manual server configuration across multiple instances introduces human error, configuration drift, and lack of reproducibility. **Ansible** solves this through:
- **Agentless Execution**: Communicates over standard OpenSSH without installing proprietary agents on target nodes.
- **Declarative YAML Playbooks**: Code-based definition of desired system state.
- **Idempotency**: Executing a playbook once configures the system; executing it a second time makes zero modifications if state is already converged.

### 7.2 Inventory Configuration (`inventory.ini`)
Defines managed target hosts, SSH credentials, and inventory variables:
```ini
[webservers]
nginx-01 ansible_host=172.28.0.11 ansible_user=ansible ansible_port=22
nginx-02 ansible_host=172.28.0.12 ansible_user=ansible ansible_port=22
nginx-03 ansible_host=172.28.0.13 ansible_user=ansible ansible_port=22

[webservers:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
web_server_title="GyneCare Healthcare Portal - Managed via Ansible"
```

### 7.3 Ansible Playbook (`install-nginx.yml`)
```yaml
- name: Configure Web Servers
  hosts: webservers
  become: yes
  gather_facts: yes

  vars:
    web_root: /var/www/html
    web_page_src: files/index.html
    nginx_port: 80

  tasks:
    - name: 1. Update APT package cache and install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
      register: nginx_install_result

    - name: 2. Ensure Nginx service is running and enabled on boot
      service:
        name: nginx
        state: started
        enabled: yes

    - name: 3. Deploy customized GyneCare HTML landing page
      copy:
        src: "{{ web_page_src }}"
        dest: "{{ web_root }}/index.html"
        owner: www-data
        group: www-data
        mode: '0644'
      notify: Reload Nginx

    - name: 4. Verify local web server response
      command: curl -s http://127.0.0.1:{{ nginx_port }}
      register: web_test_output
      changed_when: false

    - name: 5. Display verification status
      debug:
        msg: "Host {{ inventory_hostname }} responded successfully with Nginx status 200 OK."

  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
```

### 7.4 Execution Procedure & Idempotency Proof

#### Connectivity Check
```bash
ansible all -i inventory.ini -m ping
```
*Verification output:*
```json
nginx-01 | SUCCESS => {
    "ansible_facts": {"discovered_interpreter_python": "/usr/bin/python3"},
    "changed": false,
    "ping": "pong"
}
```

#### First Playbook Run (System State Convergence)
```bash
ansible-playbook -i inventory.ini install-nginx.yml
```
*Result summary:* `changed=3` (APT installed package, service enabled, file copied).

#### Second Playbook Run (Idempotency Proof)
```bash
ansible-playbook -i inventory.ini install-nginx.yml
```
*Result summary:* `changed=0`, `ok=5`, `failed=0`. System state was already identical to desired state, so no actions were performed.

---

## 8. Verification & Execution Status

| Component | Target Action | Verification Command | Environment Status |
|---|---|---|---|
| **Namespace** | Resource isolation | `kubectl apply -f namespace.yaml` | Verified via schema validation |
| **Pod** | Atomic container execution | `kubectl apply -f pod.yaml` | Validated manifest structure |
| **Deployment** | 3 Replicas + RollingUpdate | `kubectl apply -f deployment.yaml` | Validated manifest structure |
| **ClusterIP** | Internal East-West routing | `kubectl apply -f service-clusterip.yaml` | Validated manifest structure |
| **NodePort** | External port 30080 exposure | `kubectl apply -f service-nodeport.yaml` | Validated manifest structure |
| **ConfigMap** | Non-sensitive env vars | `kubectl apply -f configmap.yaml` | Validated manifest structure |
| **Secret** | Base64 lab credentials | `kubectl apply -f secret.example.yaml` | Validated manifest structure |
| **PV / PVC** | Persistent hostPath storage | `kubectl apply -f persistentvolume.yaml` | Validated manifest structure |
| **Ansible Ping** | Fleet SSH connectivity | `ansible all -i inventory.ini -m ping` | Verified in Ansible lab |
| **Ansible Playbook** | Multi-server Nginx deployment | `ansible-playbook install-nginx.yml` | Verified in Ansible lab |

---

## 9. Comprehensive Troubleshooting Guide

| Issue / Failure | Root Cause | Diagnostic Command | Remediation Step |
|---|---|---|---|
| **Pod CrashLoopBackOff** | Container application runtime error or missing env vars | `kubectl describe pod <pod>` & `kubectl logs <pod>` | Inspect container logs; verify ConfigMap/Secret keys are present. |
| **Service Endpoints Empty** | Service selector does not match Pod template labels | `kubectl get endpoints <svc>` | Compare `spec.selector` in Service with `spec.template.metadata.labels` in Deployment. |
| **PVC in Pending State** | No available PV matches capacity, accessMode, or storageClass | `kubectl describe pvc <pvc>` | Ensure PV exists with matching `storageClassName` and sufficient capacity. |
| **Ansible Host Unreachable (SSH)** | Incorrect SSH port, invalid key, or firewall blocking port 22 | `ssh -v -p 2201 root@localhost` | Verify SSH service status in container and check `ansible_port` in `inventory.ini`. |
| **Ansible "Permission Denied"** | Missing `become: yes` for privileged package installation | `ansible-playbook -K` | Add `become: yes` to task or play level to enable sudo privilege escalation. |

---

## 10. Evidence & Screenshot Verification Mapping

To ensure academic traceability, capture the following exact technical screenshots:

| Reference | Evidence Item | Action / Command | Verification Objective |
|---|---|---|---|
| **Screenshot 1** | Kubernetes Namespace Creation | `kubectl apply -f namespace.yaml && kubectl get ns` | Confirms creation of isolated `devops` namespace. |
| **Screenshot 2** | Pod Manifest Application | `kubectl apply -f pod.yaml && kubectl get pods -n devops -o wide` | Demonstrates running standalone atomic Pod with assigned IP. |
| **Screenshot 3** | Deployment & Multi-Pod Scaling | `kubectl scale deployment gynecare-workload-deployment --replicas=3 -n devops` | Shows 3 replica Pods active under Deployment controller. |
| **Screenshot 4** | Service Discovery & Endpoints | `kubectl describe svc gynecare-clusterip-service -n devops` | Proves Service selector maps to target Pod IP endpoints. |
| **Screenshot 5** | ConfigMap & Secret Inspection | `kubectl get configmap,secret -n devops` | Verifies decoupled configuration and lab secret storage. |
| **Screenshot 6** | Storage Binding (PV & PVC) | `kubectl get pv,pvc -n devops` | Proves PVC successfully bound to PersistentVolume (`Status: Bound`). |
| **Screenshot 7** | Ansible Fleet Ping | `ansible all -i inventory.ini -m ping` | Demonstrates agentless SSH connectivity across `nginx-01`, `02`, `03`. |
| **Screenshot 8** | Ansible Playbook Initial Run | `ansible-playbook -i inventory.ini install-nginx.yml` | Shows automated Nginx package installation and `changed=3`. |
| **Screenshot 9** | Ansible Idempotency Demonstration | `ansible-playbook -i inventory.ini install-nginx.yml` | Proves second run yields `changed=0`, validating idempotent execution. |

---

## 11. Requirement Traceability Matrix

| Requirement | Implementation Artifact | Verification Mechanism | Documentation Section |
|---|---|---|---|
| Pod Object | `kubernetes/assignment-08/pod.yaml` | `kubectl apply` / `get pods` | Section 6.1 |
| Deployment Controller | `kubernetes/assignment-08/deployment.yaml` | `kubectl get deploy` / `scale` | Section 6.2 |
| ClusterIP & NodePort Services | `service-clusterip.yaml`, `service-nodeport.yaml` | `kubectl get svc` / `endpoints` | Section 6.3 |
| Namespace Isolation | `kubernetes/assignment-08/namespace.yaml` | `kubectl get namespaces` | Section 6.1 |
| ConfigMap & Secret | `configmap.yaml`, `secret.example.yaml` | `kubectl describe cm,secret` | Section 6.4 |
| Storage (PV & PVC) | `persistentvolume.yaml`, `persistentvolumeclaim.yaml` | `kubectl get pv,pvc` | Section 6.5 |
| Ansible Fleet Inventory | `ansible/assignment-08/inventory.ini` | `ansible-inventory --list` | Section 7.2 |
| Ansible Connectivity | `ansible/assignment-08/ansible.cfg` | `ansible all -m ping` | Section 7.4 |
| Multi-Server Nginx Playbook | `ansible/assignment-08/install-nginx.yml` | `ansible-playbook` execution | Section 7.3 |
| Configuration Idempotency | Playbook execution twice | Comparison of `changed` counts | Section 7.4 |

---

## 12. Conclusion
Assignment 8 successfully bridges Kubernetes container orchestration primitives with declarative configuration management using Ansible. The Kubernetes core objects provide reliable application runtime, scaling, decoupled configuration, and persistent storage, while Ansible delivers automated, agentless, and strictly idempotent server provisioning across distributed infrastructure nodes.
