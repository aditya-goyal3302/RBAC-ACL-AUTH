#!/bin/bash

cd $1 || exit

echo "decrypting secrets"
bash ./etc/ci-cd/decrypt-secrets.sh .

echo "setting up configurations"
cp ./etc/secrets/.env .env

echo "building ${CONTAINER_IMAGE}"
docker build . -t "$CONTAINER_IMAGE" --build-arg BUILD_KEY=$BUILD_KEY --build-arg BUILD_ENV=$BUILD_ENV
docker push "$CONTAINER_IMAGE"

#http://docker-testings.ctdesarrollo.org:32000/v2/core-legacy/workspace-service/tags/list
