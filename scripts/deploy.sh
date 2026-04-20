#!/bin/bash
set -e

if [ -z "$DOCKERHUB_USERNAME" ]; then
  echo "DOCKERHUB_USERNAME is not set"
  exit 1
fi

echo "Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Stopping old containers..."
docker compose -f docker-compose.prod.yml down

echo "Starting updated containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Removing unused images..."
docker image prune -f

echo "Deployment completed successfully"
