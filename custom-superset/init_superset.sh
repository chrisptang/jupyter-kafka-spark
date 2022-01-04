#!/usr/bin/env bash

/usr/bin/run-server.sh

superset fab create-admin \
               --username ${USER_NAME} \
               --firstname ${USER_FIRST_NAME} \
               --lastname ${USER_LAST_NAME} \
               --email ${USER_EMAIL} \
               --password ${USER_PASSWORD} \
&& superset db upgrade \
&& superset load_examples \
&& superset init