FROM jupyter/pyspark-notebook
USER root

RUN apt update && apt install --yes cron \
    && pip install jupyterlab_scheduler \
    && jupyter labextension install jupyterlab_scheduler \
    && conda install psycopg2

USER $NB_USER

ENV USER=jovyan