# This official base image contains node.js and npm
FROM node:11.12
ARG VERSION=1.0.0
# Copy the application files
WORKDIR /
COPY /app /app
COPY /package.json /package.json
COPY /server.js /server.js
COPY /tsconfig.json /tsconfig.json
COPY /.env /.env
RUN npm install


# Set required environment variables
# ENV NODE_ENV production
# Download the required packages for production
# RUN npm update

# Make the application run when running the container
CMD ["npm", "run", "nodemon"]
