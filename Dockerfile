# =============================================================================
# Omnichannel UI — Multi-stage Dockerfile (Next.js 16)
# =============================================================================

# ===========================================================================
# Stage 1: Dependencies
# ===========================================================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ===========================================================================
# Stage 2: Builder
# ===========================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Next.js public env vars (must be available at build time)
ARG NEXT_PUBLIC_MEMORY_SERVICE_URL=http://localhost:8008
ARG NEXT_PUBLIC_GRAPHITI_URL=http://localhost:9011
ARG NEXT_PUBLIC_DEFAULT_MOCK_MODE=false

ENV NEXT_PUBLIC_MEMORY_SERVICE_URL=$NEXT_PUBLIC_MEMORY_SERVICE_URL
ENV NEXT_PUBLIC_GRAPHITI_URL=$NEXT_PUBLIC_GRAPHITI_URL
ENV NEXT_PUBLIC_DEFAULT_MOCK_MODE=$NEXT_PUBLIC_DEFAULT_MOCK_MODE
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ===========================================================================
# Stage 3: Production
# ===========================================================================
FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3030

ENV NODE_ENV=production
ENV PORT=3030
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -q --spider http://localhost:3030 || exit 1

CMD ["npm", "run", "start"]

# ===========================================================================
# Stage 4: Development
# ===========================================================================
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev"]
