#!/bin/bash

export USER_NAME="admin"
export USER_FIRST_NAME="Admin"
export USER_LAST_NAME="Superset"
export USER_EMAIL="admin@fruits.co"
export USER_PASSWORD="ptang@220104"

docker exec -it superset-prod superset fab create-admin \
               --username ${USER_NAME} \
               --firstname ${USER_FIRST_NAME} \
               --lastname ${USER_LAST_NAME} \
               --email ${USER_EMAIL} \
               --password ${USER_PASSWORD} \
&& docker exec -it superset-prod superset db upgrade \
&& docker exec -it superset-prod superset init