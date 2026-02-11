#!/bin/sh
# Espera o Postgres
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database..."
  sleep 1
done

# Roda migration
node dist/database/scripts/migrate.js

# Inicia a API
node dist/index.js
