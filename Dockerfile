
FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod --frozen-lockfile && yarn cache clean

COPY . .

EXPOSE 8080

CMD ["yarn", "dev"]
