FROM node:22-bookworm-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm cache clean --force && npm install --verbose

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
