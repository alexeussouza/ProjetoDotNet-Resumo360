# Etapa de build com Node
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa de produção com Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

