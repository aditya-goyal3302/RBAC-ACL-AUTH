#!/bin/sh

cd $1 || exit

echo "destroy testing environment"
docker compose down -v
