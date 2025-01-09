
# Étape de construction
FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./
# Installer les dépendances du projet
RUN npm install

RUN npm install -g @ionic/cli

COPY . .
