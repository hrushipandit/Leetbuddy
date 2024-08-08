# Stage 1: Node.js base image for building the frontend
FROM node:20 AS build-stage

# Set the working directory
WORKDIR /app

# Create a non-root user and switch to it
RUN useradd -m myuser -s /bin/bash
RUN chown -R myuser:myuser /app
USER myuser

# Install app dependencies
COPY --chown=myuser:myuser package*.json ./
RUN npm install

# Add your source files
COPY --chown=myuser:myuser . ./

# Set the correct permissions
USER root
RUN chmod -R 755 /app/node_modules
USER myuser

# Build the static files
RUN npm run build  # This command should be defined in your package.json to build your frontend

# Stage 2: Serve app with Nginx
FROM nginx:alpine

# Remove the default server definition
RUN rm /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ssl/leetbud.com.crt /etc/nginx/ssl/
COPY ssl/leetbud.com.key /etc/nginx/ssl/

# Copy the Nginx configuration file
COPY default.conf /etc/nginx/conf.d/

# Copy static files from build folder to Nginx serve folder
COPY --from=build-stage /app/build /usr/share/nginx/html/

# Change ownership of the html directory to nginx user and group
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
