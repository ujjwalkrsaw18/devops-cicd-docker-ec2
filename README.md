# Beginner DevOps CI/CD Project

A complete full-stack web application with React, Node.js, Docker, and an automated GitHub Actions CI/CD pipeline to AWS EC2.

## Project Structure
- `/frontend`: React app (Vite) + Nginx
- `/backend`: Node.js Express API
- `docker-compose.yml`: For local development
- `deploy.sh`: Script that runs on the EC2 server
- `.github/workflows/deploy.yml`: The automated pipeline

## 1. Local Testing with Docker
You don't need Node.js installed on your computer. Just use Docker!

1. Open a terminal in this folder.
2. Run: `docker compose up --build`
3. Visit the frontend: `http://localhost:3000`
4. Test the backend: `http://localhost:5000/api/message`

## 2. GitHub Secrets Setup
To make the automated deployment work, go to your GitHub Repository -> Settings -> Secrets and variables -> Actions. 
Add the following "New repository secrets":

- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: An access token from Docker Hub (Settings -> Security).
- `EC2_PUBLIC_IP`: The public IP address of your AWS EC2 instance (e.g., `54.23.12.9`).
- `EC2_SSH_KEY`: The entire contents of your `.pem` key file downloaded from AWS.

## 3. Initial EC2 Server Setup (One-time)
You must SSH into your EC2 Ubuntu server once and install Docker:

```bash
# Update server
sudo apt update

# Install Docker
sudo apt install docker.io -y

# Allow ubuntu user to run docker without sudo
sudo usermod -aG docker ubuntu

# VERY IMPORTANT: Apply the group change
newgrp docker
```

## 4. How the CI/CD Flow Works
Whenever you push code to the `main` branch on GitHub:
1. GitHub Actions spins up a temporary server.
2. It builds new Docker images for your Frontend and Backend.
3. It pushes those images to your Docker Hub account.
4. It securely connects to your AWS EC2 server via SSH.
5. It runs the `deploy.sh` script on the server to download the new images and restart the containers.
