FROM node:lts-bullseye

LABEL maintainer="klee2@opentext.com"

# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

ENV NODE_ENV production

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
ADD dist ./
COPY config ./config/

# Make port 5000 available to the world outside this container
EXPOSE 5000

CMD [ "node", "index.js" ]

