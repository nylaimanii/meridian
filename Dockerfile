FROM geoffreybooth/meteor-base:2.16 AS builder

COPY package*.json /app/
RUN cd /app && meteor npm install

COPY . /app/
RUN cd /app && meteor build --server-only --directory /built-app --allow-superuser

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
