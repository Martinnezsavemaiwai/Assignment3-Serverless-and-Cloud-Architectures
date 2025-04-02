FROM node:20-alpine  

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

RUN npm run build

CMD ["npm", "run", "dev", "--", "--host"]