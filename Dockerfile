# Base image
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and build artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:prod"]
