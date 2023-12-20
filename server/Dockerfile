FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#RUN npm run build  # If you need to compile TypeScript to JavaScript

EXPOSE 5000

CMD ["npm", "start"]  
