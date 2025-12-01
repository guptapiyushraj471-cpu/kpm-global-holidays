# Kubernetes manifests

Files:
- deployment.yaml — Deployment with probes, resources, securityContext
- service.yaml — ClusterIP service
- ingress.yaml — placeholder for ALB/NGINX ingress
- networkpolicy.yaml — default deny (tight network policy)

Notes:
- ServiceAccount `todo-sa` should be created in cluster and annotated for IRSA (if using AWS).
- Replace image path with the image published by CI.
- Adjust ingress annotations per your ingress controller (ALB vs nginx).
