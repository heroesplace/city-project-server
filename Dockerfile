FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache openssl
RUN npm install --quiet --production

EXPOSE 3000 
ENV NODE_ENV=production

CMD ["npm", "start"]
