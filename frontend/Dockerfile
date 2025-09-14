# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy manifests from the build context (frontend/)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy rest of the sources
COPY . .

# Build Next.js
RUN pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN npm install -g pnpm

# Copy build artifacts and dependencies
COPY --from=build /app/.next .next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

CMD ["pnpm", "start"]