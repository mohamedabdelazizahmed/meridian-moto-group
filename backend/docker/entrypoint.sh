#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    php artisan key:generate --force
fi

echo "Waiting for MySQL..."
i=0
while [ $i -lt 60 ]; do
    if php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'connected'; exit(0); } catch(\Exception \$e) { exit(1); }"; then
        echo "MySQL is up!"
        break
    fi
    i=$((i+1))
    sleep 2
done

if [ $i -eq 60 ]; then
    echo "Error: MySQL did not become available in time."
    exit 1
fi

php artisan storage:link --force
php artisan migrate --force

if [ "${SEED_ON_START:-true}" = "true" ]; then
    php artisan db:seed --force
fi

exec php artisan serve --host=0.0.0.0 --port=8000
