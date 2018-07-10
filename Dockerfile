FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN yarn install --silent
RUN yarn global add serve

CMD yarn build && serve -s build