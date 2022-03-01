#!/bin/bash

. "/opt/spark/bin/load-spark-env.sh"

export SPARK_HOST=`hostname`

BLOCK_MANAGER_PORT=${SPARK_BLOCK_MANAGER_PORT=39191}

if [ "$SPARK_WORKLOAD" == "master" ];
then
    echo "SPARK_HOST:${SPARK_HOST}" >> $SPARK_MASTER_LOG

    cd /opt/spark/bin && ./spark-class org.apache.spark.deploy.master.Master --ip ${SPARK_HOST} \
    --conf spark.blockManager.port=${BLOCK_MANAGER_PORT} \
    --port $SPARK_MASTER_PORT --webui-port $SPARK_MASTER_WEBUI_PORT >> $SPARK_MASTER_LOG

    ps aux|grep java >> $SPARK_MASTER_LOG

elif [ "$SPARK_WORKLOAD" == "worker" ];
then

    cd /opt/spark/bin && ./spark-class org.apache.spark.deploy.worker.Worker --ip ${SPARK_HOST} \
    --webui-port $SPARK_WORKER_WEBUI_PORT \
    --conf spark.blockManager.port=${BLOCK_MANAGER_PORT} \
    --port $SPARK_WORKER_PORT $SPARK_MASTER >> $SPARK_WORKER_LOG

    ps aux|grep java >> $SPARK_WORKER_LOG

elif [ "$SPARK_WORKLOAD" == "submit" ];
then
    echo "SPARK SUBMIT"
else
    echo "Undefined Workload Type $SPARK_WORKLOAD, must specify: master, worker, submit"
fi