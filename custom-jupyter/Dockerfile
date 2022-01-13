FROM jupyter/pyspark-notebook
USER root

RUN apt update && apt install --yes cron

USER $NB_USER

RUN pip install jupyterlab_scheduler \
    && jupyter labextension install jupyterlab_scheduler \
    && conda install psycopg2 \
    && pip install papermill

USER root
RUN echo "Asia/Shanghai" > /etc/timezone

USER $NB_USER

ENV USER=jovyan