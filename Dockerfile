FROM node:8

COPY package.json /package.json
RUN npm install
COPY server.js /server.js
COPY .env /.env
COPY app/ /app

CMD node server.js
