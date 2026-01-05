FROM node:trixie-slim AS build
RUN apt-get update && apt-get install -y nginx
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:trixie-perl

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g" ,"daemon off;"]