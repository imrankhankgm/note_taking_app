# Use an official lightweight Node image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Default command: Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]
