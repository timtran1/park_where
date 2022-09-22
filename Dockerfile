FROM node:18-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

EXPOSE 3000 7000
CMD [ "node", "index.js" ]
