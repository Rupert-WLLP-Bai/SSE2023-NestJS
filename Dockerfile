# Stage 1: Install dependencies
FROM oven/bun:1.1-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock* ./

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.1-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy production files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Change to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
