# Assignment 8 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 8: Kubernetes Objects, Services and Ansible Case Study**.

## Required Evidence Checklist

1. **Namespace Isolation**: Terminal output of `kubectl get namespace devops` verifying logical boundary creation.
2. **Atomic Pod Deployment**: Terminal output of `kubectl get pod gynecare-core-pod -n devops -o wide` showing assigned Pod IP and container state.
3. **Deployment Scaling**: Terminal output of `kubectl get deployment,replicasets -n devops` demonstrating replica management and desired state convergence.
4. **Service Discovery (ClusterIP & NodePort)**: Output of `kubectl get svc -n devops` and `kubectl describe svc gynecare-clusterip-service -n devops` showing endpoints mapped to backend Pod IPs.
5. **ConfigMap & Secret Decoupling**: Terminal output of `kubectl get configmaps,secrets -n devops` and inspection of non-sensitive vs sensitive data separation.
6. **Storage Binding (PV/PVC)**: Terminal output of `kubectl get pv,pvc -n devops` demonstrating `Status: Bound` for persistent data volume.
7. **Ansible Fleet Ping**: Terminal output of `ansible all -i inventory.ini -m ping` inside the Ansible control node showing successful `pong` responses from all 3 target nodes.
8. **Ansible Playbook Initial Run**: Terminal output of `ansible-playbook -i inventory.ini install-nginx.yml` demonstrating package installation, service launch, and `changed=3`.
9. **Ansible Idempotency Proof**: Terminal output of a subsequent run of `ansible-playbook -i inventory.ini install-nginx.yml` demonstrating `changed=0`, proving state stability.
10. **Target Web Server Verification**: Terminal output of `curl http://localhost:8081` (or 8082, 8083) verifying the GyneCare hospital portal is rendered.

For the full technical report, see [Assignment 8 Documentation](../../docs/assignment-8/assignment-8-documentation.md).
