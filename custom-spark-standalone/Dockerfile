FROM openjdk:11.0.11-jre-slim-buster as builder

# Add Dependencies for PySpark
RUN apt-get update && apt-get install -y curl vim wget software-properties-common ssh \
net-tools ca-certificates python3 python3-pip python3-numpy python3-matplotlib python3-scipy \
python3-pandas python3-simpy telnet iputils-ping

RUN update-alternatives --install "/usr/bin/python" "python" "$(which python3)" 1

FROM builder as apache-spark

COPY spark /opt/

WORKDIR /opt/spark

ENV SPARK_MASTER_PORT=7077 \
SPARK_MASTER_WEBUI_PORT=8080 \
SPARK_LOG_DIR=/spark-logs \
SPARK_MASTER_LOG=/spark-logs/spark-master.out \
SPARK_WORKER_LOG=/spark-logs/spark-worker.out \
SPARK_WORKER_WEBUI_PORT=8080 \
SPARK_WORKER_PORT=7000 \
SPARK_MASTER="spark://spark-master:7077" \
SPARK_WORKLOAD="master"

EXPOSE 8080 7077 7000

RUN mkdir -p $SPARK_LOG_DIR && \
touch $SPARK_MASTER_LOG && \
touch $SPARK_WORKER_LOG

COPY start-spark.sh /

CMD ["/bin/bash", "/start-spark.sh"]