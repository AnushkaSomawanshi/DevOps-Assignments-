# GyneCare Server Dockerfile
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl
RUN addgroup -S gynecaregroup && adduser -S gynecareuser -G gynecaregroup

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . ./
RUN chown -R gynecareuser:gynecaregroup /app

USER gynecareuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
