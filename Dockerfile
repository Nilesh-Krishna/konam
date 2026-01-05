FROM node:trixie-slim
RUN apt-get update && apt-get install -y nginx
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir -p /var/www/html
RUN rm -rf /var/www/html/* && \
    cp -r build/* /var/www/html/
EXPOSE 80
CMD ["nginx","-g" ,"daemon off;"]