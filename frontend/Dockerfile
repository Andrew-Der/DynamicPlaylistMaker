FROM node:13.12.0-alpine

#create app directory
RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./ 
COPY package-lock.json ./ 

RUN npm install 

ENV CHOKIDAR_USEPOLLING true
#add app
COPY . ./
# CMD npm start
CMD ["npm", "run", "start"]
