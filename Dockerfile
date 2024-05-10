FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
ARG CONFIG_SERVICE_ENDPOINT
ENV CONFIG_SERVICE_ENDPOINT=$CONFIG_SERVICE_ENDPOINT
COPY /src/assets/replace-env.sh .
RUN chmod +x replace-env.sh
RUN ./replace-env.sh
RUN ng build --configuration=production

FROM nginx:alpine
COPY --from=build-stage /app/dist/experiment-config-frontend /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf  /etc/nginx/conf.d/default.conf