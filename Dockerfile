FROM node:22-alpine AS budowanie
WORKDIR /aplikacja
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build
FROM node:22-alpine
WORKDIR /aplikacja
ENV NODE_ENV=production
COPY --from=budowanie /aplikacja/node_modules ./node_modules
COPY --from=budowanie /aplikacja/dist ./dist
COPY --from=budowanie /aplikacja/server ./server
CMD ["node", "server/serwer.mjs"]
