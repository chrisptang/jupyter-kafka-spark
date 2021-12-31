FROM node:17-alpine3.12

ADD scrapy_shopee_cate_node.js /app/scrapy_shopee_cate_node.js
ADD package.json /app/package.json

ADD empty-node-server.js /app/server.js

WORKDIR /app

RUN npm install

ENV SINK_URL "http://10.118.53.79:1688/api/1688search/sink"

ENV PORT "5000"

EXPOSE ${PORT}

CMD [ "node","server.js"]