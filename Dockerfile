# Stage 1: Build the Angular application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build the project
COPY . ./
RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the build stage
# We use a wildcard for the project folder name (Frontend) to avoid case sensitivity issues
# The standard output folder for Angular 17+ Application builder is dist/{project-name}/browser
COPY --from=build /app/dist/*/browser/ /usr/share/nginx/html/

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
