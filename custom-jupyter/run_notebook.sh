#!/bin/bash

export SHELL=/bin/bash
export HOSTNAME=f62c592f7edb
export LANGUAGE=en_US.UTF-8
export THIS_HOST_IP=10.118.55.17
export SPARK_OPTS="--master=local[2] --driver-memory=2g --executor-memory=2g"
export NB_UID=1000
export PWD=/home/jovyan
export GRANT_SUDO=yes
export TZ=Asia/Shanghai
export HOME=/home/jovyan
export LANG=en_US.UTF-8
export NB_GID=100
export XDG_CACHE_HOME=/home/jovyan/.cache/
export PASSWORD=ptang4312
export APACHE_SPARK_VERSION=3.2.0
export PYTHONPATH=/usr/local/spark/python/lib/py4j-0.10.9.2-src.zip:/usr/local/spark/python:
export USER=jovyan
export HADOOP_VERSION=3.2SHLVL=0
export CONDA_DIR=/opt/conda
export SPARK_HOME=/usr/local/spark
export SPARK_CONF_DIR=/usr/local/spark/conf
export NB_USER=jovyan
export LC_ALL=en_US.UTF-8
export PATH=/opt/conda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/spark/bin
export PYSPARK_PYTHONPATH_SET=1
export DEBIAN_FRONTEND=noninteractive
export PYDEVD_USE_FRAME_EVAL=NO

NOTEBOOK_PATH=$1

if [ -z ${NOTEBOOK_PATH} ]; then
	NOTEBOOK_PATH='/home/jovyan/work/shopee_category_search_list_df.ipynb'
fi

echo "running notebook:${NOTEBOOK_PATH}"

user=`whoami`
start_time=`date`
start_day=`date --iso`

CRON_OUT_PATH="/home/jovyan/work/out/cron.${start_day}.log"

if [ $user != 'jovyan' ]; then
	echo "this is ${user}, switching to jovyan"
	su jovyan
fi

mkdir -p /home/jovyan/work/out

echo "running cron task at:${start_time} with user:`whoami`" > ${CRON_OUT_PATH}

papermill --cwd /home/jovyan/work --stdout-file ${CRON_OUT_PATH} ${NOTEBOOK_PATH} ${NOTEBOOK_PATH}_out_${start_day}.ipynb

echo "crontab finished at:`date`, started at:${start_time}" >> ${CRON_OUT_PATH}