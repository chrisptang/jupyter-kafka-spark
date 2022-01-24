FROM jupyter/pyspark-notebook

USER root

ADD run_notebook.sh /home/$NB_USER/work

WORKDIR /home/$NB_USER/work

RUN apt update && apt install --yes cron \
    && echo "Asia/Shanghai" > /etc/timezone \
    && chmod +x run_notebook.sh

USER $NB_USER

RUN conda install psycopg2 && pip install papermill

ENV USER=jovyan