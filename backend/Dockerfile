FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV PLAYWRIGHT_BROWSERS_PATH=/app/.playwright
RUN npx playwright@1.58.2 install chromium
RUN npx playwright install-deps chromium

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]