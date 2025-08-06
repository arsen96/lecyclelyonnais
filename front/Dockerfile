FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli @ionic/cli

COPY . .

RUN ./scripts/generate-env.sh

EXPOSE 8100

CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100"]
