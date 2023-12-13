FROM node:16.20-buster

WORKDIR /usr/src/app

COPY package*.json ./
    
# RUN yarn install
# instrall with lock
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8080

CMD ["yarn", "dev"]