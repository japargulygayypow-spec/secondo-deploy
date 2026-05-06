# Build stage only - output goes to volume
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM alpine:latest

WORKDIR /app

# Copy built files to a temporary location to avoid being hidden by the volume mount
COPY --from=builder /app/dist /app/temp_dist

# Clean destination and copy files at runtime, then keep container running
# Handle potential empty directory or existing files gracefully
CMD ["sh", "-c", "rm -rf /app/dist/* || true && cp -r /app/temp_dist/* /app/dist/ && tail -f /dev/null"]
