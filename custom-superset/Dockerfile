FROM apache/superset:1.4.0rc1

ENV USER_NAME "admin"
ENV USER_EMAIL "admin@example.com"
ENV USER_PASSWORD "admin@superset123"
ENV USER_FIRST_NAME "Admin-FirstName"
ENV USER_LAST_NAME "Admin-LastName"

ADD init_superset_user.sh /app/init_superset_user.sh

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]