docker exec -it superset-prod superset fab create-admin \
               --username admin \
               --firstname Admin \
               --lastname Yet \
               --email admin@yet-fast.com \
               --password yet@1243-fast \



docker exec -it superset-prod superset db upgrade


docker exec -it superset-prod superset load_examples


docker exec -it superset-prod superset init