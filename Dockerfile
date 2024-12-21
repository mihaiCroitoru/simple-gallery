# Use an official Node.js runtime as a parent image
FROM node:20 AS builder

# Install yarn
RUN npm install -g yarn --force

# Set the working directory in the container
WORKDIR /app

# Copy server's package.json and yarn.lock to install server dependencies first
COPY server/package.json server/yarn.lock ./server/

# Install server dependencies
RUN cd server && yarn install --frozen-lockfile

# Copy client's package.json and yarn.lock to install client dependencies
COPY client/package.json client/yarn.lock ./client/

# Install client dependencies
RUN cd client && yarn install --frozen-lockfile

# Copy the entire server code into the container
COPY server/ ./server/

# Copy the entire client code into the container
COPY client/ ./client/

# Build the React app
RUN cd client && yarn build

# Copy the built client files to /server/client
RUN cp -r client/build/* ./server/client/

# Expose port 3000 to the outside world
EXPOSE 3000

WORKDIR /app/server
# Command to run the Express server
CMD ["yarn", "start"]
