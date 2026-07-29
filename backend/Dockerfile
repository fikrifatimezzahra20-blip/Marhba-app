FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

# Expose server port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
