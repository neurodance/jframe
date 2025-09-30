# syntax=docker/dockerfile:1.7

# Use Node 22 LTS-aligned image
FROM node:22.17.1-alpine AS base
WORKDIR /app

# Set production defaults; override in dev as needed
ENV NODE_ENV=production

# Copy only manifest first for better layer caching if deps added later
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install a minimal package manager if needed
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate; \
    elif [ -f yarn.lock ]; then corepack enable && corepack prepare yarn@stable --activate; \
    else corepack enable && corepack prepare npm@latest --activate; fi

# Install deps when lockfile present; otherwise skip to runtime copy
RUN if [ -f package-lock.json ] || [ -f pnpm-lock.yaml ] || [ -f yarn.lock ]; then \
      echo "Installing dependencies" && \
      if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
      elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
      else npm ci; fi; \
    else echo "No lockfile; will install later if needed"; fi

# Copy the rest of the source
COPY . .

# Expose common serve port
EXPOSE 3000 8000

# Default command uses npm scripts if available
CMD ["sh", "-lc", "if npm run | grep -q 'serve'; then npm run serve; else npx serve . -l 3000; fi"]
