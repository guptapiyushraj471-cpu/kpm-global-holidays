# Dockerfile placeholder# build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build || true

# runtime
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app ./
USER appuser
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","src/index.js"]
