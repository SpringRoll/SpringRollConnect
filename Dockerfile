FROM node:8

COPY package.json /package.json
COPY app/ /app
COPY server.js /server.js

RUN npm install
CMD node server.js
