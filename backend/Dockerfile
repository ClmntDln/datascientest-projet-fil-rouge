FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev gcc postgresql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY wait-for-db.sh /wait-for-db.sh
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /wait-for-db.sh /docker-entrypoint.sh && \
    python manage.py collectstatic --noinput

EXPOSE 8000
ENTRYPOINT ["/docker-entrypoint.sh"]
