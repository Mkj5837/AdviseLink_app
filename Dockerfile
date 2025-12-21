FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Render will set PORT at runtime; expose a sensible default
EXPOSE 3001

CMD ["npm", "start"]
