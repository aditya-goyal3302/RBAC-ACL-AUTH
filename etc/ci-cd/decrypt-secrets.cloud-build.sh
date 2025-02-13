#!/bin/sh

cd $1 || exit

if [ -z "$BUILD_ENV" ]; then echo "BUILD_ENV empty"; exit 1; fi;
echo "BUILD_ENV READY"

if [ -z "$BUILD_KEY" ]; then echo "BUILD_KEY empty"; exit 1; fi;
echo "BUILD_KEY READY"

SECRET_FILE=./etc/secrets.tar.gz.ssl
cp "./etc/secrets.${BUILD_ENV}.tar.gz.ssl" "$SECRET_FILE"
decrypt-secrets.sh "$BUILD_KEY"
rm "$SECRET_FILE"

echo "setting up configurations"
mv ./etc/secrets/.env ./
