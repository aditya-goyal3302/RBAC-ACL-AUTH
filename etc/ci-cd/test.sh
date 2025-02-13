#!/bin/sh

cd $1 || exit

echo "set up testing environment"
cp .env.example .env
docker compose up -d php.dev
docker compose exec php.dev composer install
sleep 10

echo "_execute tests"
docker compose exec php.dev ./vendor/bin/phpunit \
  --config phpunit.xml --coverage-clover ./storage/tests/phpunit.coverage.xml \
  --coverage-cobertura ./storage/tests/phpunit.cobertura.xml \
  --log-junit ./storage/tests/phpunit.xml
