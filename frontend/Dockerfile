# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build
COPY . .

# Pass an argument for the API URL during build (if needed)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build the project for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy our custom Nginx config to replace the default one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
