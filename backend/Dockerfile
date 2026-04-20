# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker's layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend source code
COPY . .

# Expose port 5000 so it can be accessed outside the container
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
