#!/bin/sh
set -e

host="$1"
shift

until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL n'est pas encore prêt - attente..."
  sleep 1
done

>&2 echo "PostgreSQL est prêt - exécution de la commande"
exec "$@"
