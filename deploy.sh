#!/bin/bash
set -e

# This script is run on the EC2 instance to deploy the latest containers

if [ -z "$DOCKERHUB_USERNAME" ]; then
  echo "Error: DOCKERHUB_USERNAME environment variable is not set."
  exit 1
fi

# Ensure the network exists
docker network create app-network || true

echo "Pulling latest images from Docker Hub..."
docker pull $DOCKERHUB_USERNAME/devops-backend:latest
docker pull $DOCKERHUB_USERNAME/devops-frontend:latest

echo "Stopping existing containers..."
docker stop devops-backend devops-frontend || true
docker rm devops-backend devops-frontend || true

echo "Starting backend container..."
docker run -d \
  --name devops-backend \
  --restart always \
  -p 5000:5000 \
  -e PORT=5000 \
  --network app-network \
  $DOCKERHUB_USERNAME/devops-backend:latest

echo "Starting frontend container..."
docker run -d \
  --name devops-frontend \
  --restart always \
  -p 80:80 \
  --network app-network \
  $DOCKERHUB_USERNAME/devops-frontend:latest

echo "Cleaning up old images..."
docker image prune -f

echo "✅ Deployment completed successfully!"
