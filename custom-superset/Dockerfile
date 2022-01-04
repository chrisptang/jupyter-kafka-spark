FROM apache/superset:1.4.0rc1

ADD init_superset.sh /app/init_superset.sh

WORKDIR /app

# RUN chmod +x init_superset.sh

ENV USER_NAME "admin"
ENV USER_EMAIL "admin@example.com"
ENV USER_PASSWORD "admin@superset123"
ENV USER_FIRST_NAME "Admin-FirstName"
ENV USER_LAST_NAME "Admin-LastName"

CMD ["/bin/sh" "-c" "init_superset.sh"]