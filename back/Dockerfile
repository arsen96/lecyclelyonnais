FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copier le reste de l'application
COPY . .
