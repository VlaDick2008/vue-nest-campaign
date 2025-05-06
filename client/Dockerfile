FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN npm install -g bun \
 && bun install

COPY . .
RUN bun run build

FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
