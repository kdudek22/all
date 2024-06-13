#!/bin/sh


while ! pg_isready -h "postgres" -U "user" -q; do
  sleep 1
done

alembic revision --autogenerate -m "Update model"

alembic upgrade head

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
