FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
