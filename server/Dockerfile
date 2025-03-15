FROM node:23-alpine3.20

WORKDIR /app

RUN mkdir -p dist/src/blob-images

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

# Start the server
CMD ["node", "dist/src/app.js"]