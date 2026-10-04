# Assignment 9 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 9: Kubernetes Container Orchestration and Helm Packaging Mechanics**.

## Required Evidence Checklist

1. **Helm Client Build Info**: Terminal output of `helm version` displaying client architecture and version.
2. **Chart File Hierarchy**: Output of directory tree command on `helm/gynecare/` demonstrating `Chart.yaml`, `values.yaml`, and `templates/`.
3. **Chart Metadata & Values**: Display of `Chart.yaml` showing semantic `version` vs `appVersion`, and `values.yaml` showing configured parameters.
4. **Local Template Compilation**: Terminal capture of `helm template gynecare ./helm/gynecare` showing the rendered Kubernetes YAML stream.
5. **Release Deployment**: Terminal output of `helm install gynecare ./helm/gynecare --namespace devops` showing release output and `NOTES.txt`.
6. **Release Status & Active Workloads**: Terminal output of `helm list -n devops` and `kubectl get pods,svc,pvc -n devops`.
7. **Release Rolling Upgrade**: Terminal output of `helm upgrade gynecare ./helm/gynecare --set frontend.replicaCount=3 -n devops`.
8. **Release Revision History**: Terminal output of `helm history gynecare -n devops` showing revision 1 and revision 2 with timestamps.
9. **Clean Release Uninstallation**: Terminal output of `helm uninstall gynecare -n devops` and confirmation of resource cleanup via `kubectl get all -n devops`.

For the full technical report, see [Assignment 9 Documentation](../../docs/assignment-9/assignment-9-documentation.md).
