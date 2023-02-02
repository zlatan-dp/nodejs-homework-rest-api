FROM node

WORKDIR /phonebook-api

COPY . .

RUN npm install

EXPOSE 3000

CMD ['node', 'server.js']

