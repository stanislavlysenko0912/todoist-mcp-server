FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

ENV API_KEY=API_TOKEN_HERE

ENTRYPOINT ["node", "dist/index.js"]
