#!/bin/bash
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn --workers 5 --threads 8 --bind 0.0.0.0:8000 accounts.wsgi:application
