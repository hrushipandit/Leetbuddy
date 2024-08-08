# Start with the official Nginx image
FROM nginx:alpine


# Remove the default server definition
RUN rm /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ssl/leetbud.com.crt /etc/nginx/ssl/
COPY ssl/leetbud.com.key /etc/nginx/ssl/

# Copy the Nginx configuration file
COPY default.conf /etc/nginx/conf.d/

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
