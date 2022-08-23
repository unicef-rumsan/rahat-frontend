# Stage 1 - the build process
# FROM node:14.17.0-alpine3.13 AS builder
# WORKDIR /usr/src/app
# COPY package.json yarn.lock ./
# RUN yarn
# COPY . .
# RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.23.1-alpine
# Nginx config
RUN rm -rf /etc/nginx/conf.d
#copies the content of conf.d to sepcified directory i.e. /etc/nginx/conf.d
COPY conf.d /etc/nginx/conf.d
# Static build
COPY build /usr/share/nginx/html 
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html 
# Default port exposure
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
