#!/bin/bash

cd $1 || exit

#load env variables
if test -f .env; then
    set -o allexport
    source .env
    set +o allexport
fi

if [ -z "$BUILD_KEY" ]; then
    # shellcheck disable=SC2039
    read -sr -p "ENTER A SECRET PHRASE: " BUILD_KEY
    echo ""
fi

if [ -z "$BUILD_ENV" ]; then
  read -rp "SPECIFY THE BUILD ENVIRONMENT: " BUILD_ENV
fi

SECRET_FILE=./etc/secrets.tar.gz.ssl
docker run -it -v "${PWD}:/app" kytel0925/ci-cd encrypt-secrets.sh "$BUILD_KEY"
docker run -it -v "${PWD}:/app" kytel0925/ci-cd mv "$SECRET_FILE" "./etc/secrets.${BUILD_ENV}.tar.gz.ssl"
