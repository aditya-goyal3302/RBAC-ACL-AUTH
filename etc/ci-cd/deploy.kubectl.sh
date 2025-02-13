#!/bin/bash

cd $1 || exit

#load env variables
if test -f .env; then
  set -o allexport
  # shellcheck disable=SC2039
  source .env
  set +o allexport
fi

if [ -z "$BUILD_ENV" ]; then
  # shellcheck disable=SC2039
  read -rp "SPECIFY THE BUILD ENVIRONMENT: " BUILD_ENV
fi

echo "deploying env: $BUILD_ENV"
sed -i "s,localhost:32000/image:latest,${CONTAINER_IMAGE}," ./etc/kubernetes/ci-cd/*.yml
sed -i "s,${CONTAINER_REGISTRY},localhost:32000," ./etc/kubernetes/ci-cd/*.yml
sed -i "s,{BUILD_ENV},${BUILD_ENV}," ./etc/kubernetes/ci-cd/*.yml

#kubectl delete namespace ${REBUILD_ENV_NAMESPACE}
kubectl apply -f "./etc/kubernetes/ci-cd/namespace.yml"
kubectl apply \
    -f "./etc/kubernetes/ci-cd/deployment.yml" \
    -f "./etc/kubernetes/ci-cd/service.yml" \
    -f "./etc/kubernetes/ci-cd/ingress.yml"
    #-f "./etc/kubernetes/ci-cd/job.release.yml"
