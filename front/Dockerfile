FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli @ionic/cli

COPY . .

# Build pour production
RUN ionic build --prod

# Étape de production avec Nginx
FROM nginx:alpine

# Copier le build depuis l'étape précédente
COPY --from=build /usr/src/app/www /usr/share/nginx/html

# Copier la config nginx pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]