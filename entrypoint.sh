#!/bin/sh

echo "Checking if database is ready..."

# 'db' is the name of the service in your docker-compose.yml
# 5432 is the default Postgres port
while ! nc -z db 5432; do
  echo "Database not ready yet... sleeping"
  sleep 1
done

echo "Database is UP!"

# Now it is safe to do the Django stuff
python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"