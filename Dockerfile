# Use the official Node.js image as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /var/www/html

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 3500 to allow incoming connections to the container
EXPOSE 3500

# Command to run the application
CMD ["node", "server.js"]
