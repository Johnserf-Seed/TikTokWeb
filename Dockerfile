# specify the node base image with your desired version node:<version>
FROM node:18-alpine3.14
# replace this with your application's default port
EXPOSE 8888

# Create app directory
RUN mkdir -p /home/Service
WORKDIR /home/Service

# Bundle app source
COPY . /home/Service
# RUN npm config set registry https://registry.npm.taobao.org
RUN npm install 
RUN npm install -g bower 

CMD [ "npm","start" ]
