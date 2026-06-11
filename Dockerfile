FROM node:latest

WORKDIR /app
COPY . /app

RUN npm install

ENV AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
ENV DB_PASSWORD="Pa55w0rd!"
ENV JWT_SECRET="django-insecure-do-not-use-0000000000"

EXPOSE 3000
CMD ["node", "app.js"]
