FROM node:14-alpine

RUN apk add --update --no-cache git python3 libtool libpng-dev jpeg-dev pango-dev cairo-dev giflib-dev g++ make

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]