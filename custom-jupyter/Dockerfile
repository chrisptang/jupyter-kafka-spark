FROM jupyter/pyspark-notebook

USER root

RUN apt update && apt install --yes cron \
    && echo "Asia/Shanghai" > /etc/timezone

USER $NB_USER

RUN conda install psycopg2 && pip install papermill

ADD run_notebook.sh /home/$NB_USER/work

WORKDIR /home/$NB_USER/work

RUN chmod +x run_notebook.sh

ENV USER=jovyan