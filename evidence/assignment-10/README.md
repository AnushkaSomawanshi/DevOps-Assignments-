# Assignment 10 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 10: Discover Kubernetes Objects and Networking Services**.

## Required Evidence Checklist

1. **Pod Lifecycle**: Terminal output of `kubectl get pods -n devops -o wide` showing Pod status, IP address, and node assignment.
2. **Deployment Scaling**: Terminal output of `kubectl get deployments,replicasets -n devops` demonstrating managed replica counts.
3. **ClusterIP Service**: Terminal output of `kubectl describe svc gynecare-clusterip-service -n devops` proving internal IP assignment and endpoint mapping.
4. **NodePort Service**: Terminal output of `kubectl get svc gynecare-nodeport-service -n devops` showing static node port 30080 mapping to container port 80.
5. **LoadBalancer Behavior**: Terminal output of `kubectl get svc gynecare-loadbalancer-service -n devops` documenting local environment pending behavior.
6. **ExternalName Alias**: Terminal output of `kubectl describe svc gynecare-external-db -n devops` showing external DNS alias configuration.
7. **ConfigMap & Secret**: Terminal output of `kubectl get configmap,secret -n devops` demonstrating decoupled configuration storage.
8. **Storage Persistence**: Terminal output of `kubectl get pv,pvc -n devops` showing `Status: Bound` for the database claim.
9. **Full Resource Overview**: Terminal output of `kubectl get all -n devops` capturing the complete deployed object graph.

For the full technical report, see [Assignment 10 Documentation](../../docs/assignment-10/assignment-10-documentation.md).
