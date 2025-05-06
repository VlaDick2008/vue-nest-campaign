FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install -g bun \
 && bun install

COPY . .
RUN bun run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
