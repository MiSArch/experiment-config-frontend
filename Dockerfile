FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN ng build --configuration=production

FROM nginx:alpine
COPY --from=build-stage /app/dist/experiment-config-frontend /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf.template  /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]