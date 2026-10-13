FROM node:22-alpine AS Build-Stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS Runtime-Stage

WORKDIR /app

COPY --from=Build-Stage /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

USER node

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]


