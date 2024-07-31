FROM node:20-alpine

ARG NODE_ENV
ARG NODE_CONFIG_ENV
ARG TIMESTAMP
ARG PORT

ENV NODE_ENV=${NODE_ENV:-production}
ENV NODE_CONFIG_ENV=$NODE_CONFIG_ENV
ENV TIMESTAMP=$TIMESTAMP
ENV PORT=${PORT:-8080}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --include=dev --ignore-scripts

EXPOSE ${PORT:-8080}
CMD npm run dev
