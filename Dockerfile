FROM node:lts-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install --quiet --production

EXPOSE 3000 3001

CMD [ "npm", "start" ]