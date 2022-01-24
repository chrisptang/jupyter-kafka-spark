#!/bin/bash

MY_USER_NAME=${USER_NAME:"admin"}
MY_USER_FIRST_NAME=${USER_FIRST_NAME:"Admin"}
MY_USER_LAST_NAME=${USER_LAST_NAME:"Superset"}
MY_USER_EMAIL=${USER_EMAIL:"admin@some-domin.co"}
MY_USER_PASSWORD=${USER_PASSWORD:"Admin@220101.superset"}

echo "init superset with user name:${MY_USER_NAME}"

superset fab create-admin \
               --username ${MY_USER_NAME} \
               --firstname ${MY_USER_FIRST_NAME} \
               --lastname ${MY_USER_LAST_NAME} \
               --email ${MY_USER_EMAIL} \
               --password ${MY_USER_PASSWORD} \
&& superset db upgrade \
&& superset init