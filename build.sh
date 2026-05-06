#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata product/fixtures/sizes.json || true
python manage.py loaddata product/fixtures/categories.json || true
python manage.py loaddata product/fixtures/products.json || true
python manage.py loaddata product/fixtures/product_variants.json || true
