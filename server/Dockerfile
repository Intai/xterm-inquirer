FROM node:20-alpine

ARG NODE_ENV
ARG NODE_CONFIG_ENV
ARG PORT

ENV NODE_ENV=${NODE_ENV:-production}
ENV NODE_CONFIG_ENV=$NODE_CONFIG_ENV
ENV PORT=${PORT:-8081}

RUN mkdir -p /usr/src/commands
WORKDIR /usr/src/commands
COPY --from=commands . /usr/src/commands
RUN apk add g++ make py3-pip
RUN npm install

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install

EXPOSE ${PORT:-8081}
CMD npm start
