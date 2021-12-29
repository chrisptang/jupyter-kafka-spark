FROM node:17-alpine3.12

ADD scrapy_shopee_cate_node.js /app/scrapy_shopee_cate_node.js

CMD [ "node" ,"-v"]