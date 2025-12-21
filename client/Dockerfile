FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build for production
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
