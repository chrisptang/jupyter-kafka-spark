FROM node:17-alpine3.12

# ADD package.json /app/frontend/package.json
# ADD index.html /app/frontend/index.html
# ADD src /app/frontend/
# ADD static /app/frontend/
# ADD config /app/frontend/
# ADD build /app/frontend/

ADD dist /app/frontend/

ADD server/package.json /app/server/package.json
ADD server/scrapy-service.js /app/server/scrapy-service.js
ADD server/server.js /app/server/server.js

# WORKDIR /app/frontend

# RUN npm install && npm run build && mv dist /app/server/

WORKDIR /app/server
RUN npm install

ADD server/scrapy-config.js /app/server/scrapy-config.js
ADD server/http-proxy.js /app/server/http-proxy.js

ENV SINK_URL "http://10.118.53.79:1688/api/1688search/sink"
ENV PORT "5000"
ENV SERVER_STATIC_PATH "/app/frontend"
ENV NODE_ENV "production"
ENV PG_HOST "db-postgres"
ENV PG_USER "postgres"
ENV PG_PASSWORD "postgres-local"
ENV PROXY_SECRET "please_set_PROXY_SECRET_env"

# default: hard_coded categories for each country;
# database: fetch categories from database;
ENV TASK_SOURCE "database" 


EXPOSE ${PORT}

CMD [ "node","server.js"]