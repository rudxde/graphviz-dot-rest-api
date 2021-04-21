FROM node:12-alpine

WORKDIR /app

RUN apk add graphviz

COPY ./package.json ./
RUN npm i
COPY ./lerna.json ./

COPY ./packages/api/package.json ./packages/api/

# RUN npx lerna list

RUN npm run bootstrap

COPY ./packages ./packages

RUN npm run build

ENTRYPOINT [ "npm", "start" ]
# ENTRYPOINT [ "/bin/sh" ]
