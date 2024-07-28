# use an official node runtime as a base image
from node:20 as build

# set the working directory in the container
workdir /usr/src/app

# install dependencies
copy package*.json ./
run npm install

# bundle app source inside the docker image
copy . .
RUN chmod +x node_modules/.bin/react-scripts 

# build the application
run npm run build

# use nginx to serve the react application
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000:80
CMD ["nginx", "-g", "daemon off;"]
