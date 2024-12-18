FROM node:14.16.0

WORKDIR /home/token_manager_server

COPY package.json ./

ENV ACCESS_TOKEN_SECRET=528c4cf6-7640-4d5e-825a-c20a00f0
ENV ACCESS_TOKEN_LIFETIME=900s
ENV REFRESH_TOKEN_SECRET=6f8d96a9-987e-42d4-9136-ca5a27
ENV REFRESH_TOKEN_LIFETIME=432000s
ENV ALLOW_ANONYMOUS=false

RUN npm install

COPY . ./

CMD ["npm", "start"]