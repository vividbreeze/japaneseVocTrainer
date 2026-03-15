# syntax=docker/dockerfile:1

# ─────────────── Stage 1: deps ───────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─────────────── Stage 2: dev ───────────────
# Used by docker-compose.dev.yml
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm", "run", "dev"]

# ─────────────── Stage 3: builder ───────────────
FROM deps AS builder
WORKDIR /app
COPY . .
# Skip seed during build (runs at startup)
ENV DATABASE_PATH=/app/data/vocab.db
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─────────────── Stage 4: runner (production) ───────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 make g++ && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy server-side assets needed at runtime
COPY --from=builder /app/db ./db
COPY --from=builder /app/data ./data
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Ensure data directory is writable
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const http=require('http');const req=http.request({host:'localhost',port:3000,path:'/api/settings'},r=>{process.exit(r.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.end()"

# Seed DB then start Next.js
CMD ["sh", "-c", "npx tsx scripts/seed.ts && node server.js"]
