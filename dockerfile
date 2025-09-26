FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY . .

CMD [ "node", "src/server.js" ]