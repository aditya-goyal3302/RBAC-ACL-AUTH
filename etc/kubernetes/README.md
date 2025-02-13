# Kubernetes yml files for staging environment

## Requirements

- kubernetes cluster (microk8s, k3s, minikube, GKE, etc)
  - ip address
  - public ingress
  - dns entry
- cluster access to apply all this manifests
- yml's (namespace, deployment, service and ingress*) with default setting
- a bash script replacing the following string
  - BUILD_ENV key
  - latest image build (hash)
