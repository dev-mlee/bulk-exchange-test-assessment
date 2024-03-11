FROM node:21.2.0-alpine
WORKDIR /home/web
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
WORKDIR /home/web/frontend/
EXPOSE 3000
CMD ["npm", "start"]
