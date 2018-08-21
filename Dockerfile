FROM node:10

COPY package.json /package.json
COPY npm-shrinkwrap.json /npm-shrinkwrap.json
RUN npm install
COPY server.js /server.js
COPY .env /.env
COPY app/ /app

CMD node server.js
