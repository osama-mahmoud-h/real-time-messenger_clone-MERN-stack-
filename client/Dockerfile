# Client Dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#RUN npm run build  # Compiles the React app

EXPOSE 3000

CMD ["npm", "start"]
