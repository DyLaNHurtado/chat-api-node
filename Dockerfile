FROM node:13

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

EXPOSE 8888

CMD [ "npm" , "start"]