# Use the official Node.js image from the Docker Hub
FROM node:20.15.0

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "run", "dev"]