FROM python:3.10-bookworm

ENV DJANGO_SETTINGS_MODULE backend.docker_settings
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update

RUN pip install --upgrade pip

COPY ./requirements.txt /app

RUN pip install -r requirements.txt --no-cache-dir

COPY . /app

EXPOSE 8000

CMD python manage.py migrate --noinput && \
    python manage.py migrate api --noinput && \
    python manage.py loaddata showcase_data.json && \
    python manage.py runserver 0.0.0.0:8000