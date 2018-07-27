FROM node:alpine
RUN apk update && apk add git

RUN mkdir /app
WORKDIR /app

COPY . /app

#RUN rm -f /app/yarn.lock
RUN yarn install --silent
RUN yarn global add serve react-scripts
RUN yarn build

RUN mkdir -pv run
RUN cp -r build run/

CMD cd run/ && serve -s build