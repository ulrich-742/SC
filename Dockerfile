# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY server/package*.json server/
COPY client/package*.json client/
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/server/database server/database
COPY --chown=node:node --from=build /app/server/public server/public
COPY --from=build /app/client/dist client/dist
USER node
EXPOSE 3000
CMD ["sh", "-c", "node server/dist/bin/migrate.js && node server/dist/src/main.js"]
