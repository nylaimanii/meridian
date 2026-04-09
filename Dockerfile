FROM node:20-slim AS builder

# Install system dependencies Meteor needs
RUN apt-get update && apt-get install -y \
    curl bash procps python3 build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Meteor 3.4
RUN curl https://install.meteor.com/?release=3.4 | sh

ENV PATH="/root/.meteor:$PATH"

WORKDIR /app

# Copy full app (needs .meteor/release present for meteor npm install)
COPY . .

# Install npm deps including devDependencies (needed for rspack build)
RUN meteor npm install --include=dev

# Build the Meteor bundle
RUN meteor build --server-only --directory /built-app --allow-superuser

# ── Runtime stage ──────────────────────────────────────────────────
FROM node:20-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /built-app/bundle /app/bundle

WORKDIR /app/bundle/programs/server
RUN npm install

WORKDIR /app/bundle

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD node main.js
