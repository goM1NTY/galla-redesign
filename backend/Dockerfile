FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY tsconfig.json ./
COPY src ./src

RUN npm run build && npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:deploy && npm run start"]


