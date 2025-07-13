FROM node:18.17.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copier le reste de l'application
COPY . .
