# FROM node:latest AS build

# WORKDIR /usr/src/app


# # Docker fonctionne avec des couches et des caches,
# # en copiant package json et lock cela permet de les charger uniquement si ils ont changé
# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# FROM nginx:alpine

# COPY --from=build /usr/src/app/www /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# # 
# # EXPOSE 80


# # Étape de construction
# FROM node:latest AS build

# # Définir le répertoire de travail
# WORKDIR /usr/src/app

# # Copier les fichiers package.json et package-lock.json pour installer les dépendances
# COPY package*.json ./

# # Installer les dépendances du projet
# RUN npm install

# # Copier le reste du projet dans le conteneur
# COPY . .

# # Exposer le port 8100 pour Ionic
# EXPOSE 8100

# # Lancer Ionic Serve
# CMD ["npm", "run", "ionic:serve"]


# Étape de construction
FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./
# Installer les dépendances du projet
RUN npm install

RUN npm install -g @ionic/cli

COPY . .
