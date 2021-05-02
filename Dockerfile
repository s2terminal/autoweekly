FROM node:alpine

WORKDIR /app
RUN apk add --no-cache git vim

COPY package.json ./
COPY package-lock.json ./
RUN npm install

# RUN npm run server
