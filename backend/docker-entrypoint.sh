#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
    export POSTGRES_USER="${POSTGRES_USER:-$DB_USER}"
    export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-$DB_PASSWORD}"
    export POSTGRES_DB="${POSTGRES_DB:-$DB_NAME}"
    /wait-for-db.sh "$DB_HOST" true
fi

python manage.py migrate --noinput
python manage.py seed
exec gunicorn weeb.wsgi:application --bind 0.0.0.0:8000
