#!/bin/bash

export container_name=`docker ps |grep "apache/superset"|awk '{print $12}'`

export USER_NAME="admin"
export USER_FIRST_NAME="Admin"
export USER_LAST_NAME="Superset"
export USER_EMAIL="admin@fruits.co"
export USER_PASSWORD="ptang@220104"

docker exec -it ${container_name} superset fab create-admin \
               --username ${USER_NAME} \
               --firstname ${USER_FIRST_NAME} \
               --lastname ${USER_LAST_NAME} \
               --email ${USER_EMAIL} \
               --password ${USER_PASSWORD} \
&& docker exec -it ${container_name} superset db upgrade \
&& docker exec -it ${container_name} superset init