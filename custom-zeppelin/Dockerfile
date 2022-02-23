FROM ubuntu:20.04

ENV SPARK_DOWNLOAD_URL=https://dlcdn.apache.org/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz \
ZEPPELIN_DOWNLOAD_URL=https://dlcdn.apache.org/zeppelin/zeppelin-0.10.0/zeppelin-0.10.0-bin-netinst.tgz \
SPARK_HOME=/opt/spark \
ZEPPELIN_HOME=/opt/zeppelin \
ZEPPELIN_PORT=8280 \
ZEPPELIN_ADDR=0.0.0.0

USER root

RUN apt update && apt -y install wget && wget --no-verbose -O apache-spark.tgz "${SPARK_DOWNLOAD_URL}" \
&& mkdir -p ${SPARK_HOME} \
&& tar -xf apache-spark.tgz -C ${SPARK_HOME} --strip-components=1 \
&& rm apache-spark.tgz \
&& wget --no-verbose -O zeppelin-0.10.0.tgz "${ZEPPELIN_DOWNLOAD_URL}" \
&& mkdir -p ${ZEPPELIN_HOME} \
&& tar -xf zeppelin-0.10.0.tgz -C ${ZEPPELIN_HOME} --strip-components=1 \
&& rm zeppelin-0.10.0.tgz

ADD ./zeppelin-env.sh ${ZEPPELIN_HOME}/conf/zeppelin-env.sh

USER 1000

WORKDIR /opt/zeppelin

EXPOSE ${ZEPPELIN_PORT}

CMD ["bin/zeppelin.sh"]