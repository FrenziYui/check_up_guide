FROM node:18.13.0-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run generate

# Step 2: Create Nginx Server
FROM nginx:1.25.1 AS prod-stage
# Add nginx config
COPY nginx.conf /temp/prod.conf
RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
