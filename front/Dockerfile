
# Étape de construction
FROM node:18.17.1 AS build

WORKDIR /usr/src/app

COPY package*.json ./
# Installer les dépendances du projet
RUN npm install

RUN npm install -g @ionic/cli

COPY . .
