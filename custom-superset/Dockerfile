FROM apache/superset:1.4.0rc1

COPY init_superset.sh /app/init_superset.sh

WORKDIR /app

USER root

ENV USER_NAME "admin"
ENV USER_EMAIL "admin@example.com"
ENV USER_PASSWORD "admin@superset123"
ENV USER_FIRST_NAME "Admin-FirstName"
ENV USER_LAST_NAME "Admin-LastName"

RUN ["chmod", "+x", "/app/init_superset.sh"]

ENTRYPOINT ["/app/init_superset.sh"]