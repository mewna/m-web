FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN rm -f /app/yarn.lock
RUN yarn install --silent
RUN yarn global add serve react-scripts

CMD yarn build && serve -s build