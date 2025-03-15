FROM node:20.13.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

# Start the server
CMD ["node", "dist/src/app.js"]