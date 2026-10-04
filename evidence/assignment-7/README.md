# Assignment 7 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 7: Kubernetes Architecture and Helm**.

## Required Evidence Checklist

1. **Kubernetes Cluster Info**: Terminal output of `kubectl cluster-info` and `kubectl get nodes` showing active cluster status.
2. **Helm Installation**: Output of `helm version` showing client build metadata.
3. **Helm Chart Anatomy**: Directory tree capture of `helm/gynecare/` displaying `Chart.yaml`, `values.yaml`, and the `templates/` directory.
4. **Template Rendering**: Terminal output of `helm template gynecare ./helm/gynecare` demonstrating dynamic substitution of values into Kubernetes manifests.
5. **Helm Release Installation**: Terminal output of `helm install gynecare ./helm/gynecare --namespace devops` showing successful release provisioning.
6. **Active Cluster Workloads**: Terminal output of `kubectl get pods,services,pvc -n devops` showing healthy GyneCare frontend, backend, and MongoDB instances.
7. **Release Upgrade & Uninstall**: Output of `helm upgrade` and subsequent `helm uninstall` confirming release lifecycle control.

For the complete technical report, see [Assignment 7 Documentation](../../docs/assignment-7/assignment-7-documentation.md).
