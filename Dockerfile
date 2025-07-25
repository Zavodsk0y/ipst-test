FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json bun.lockb ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:local"]
