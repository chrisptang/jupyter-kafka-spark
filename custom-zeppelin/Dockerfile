FROM apache/zeppelin:0.10.0

ENV SPARK_DOWNLOAD_URL=https://dlcdn.apache.org/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz \
SPARK_HOME=/opt/spark \
ZEPPELIN_PORT=8280 \
ZEPPELIN_ADDR=0.0.0.0 \
SPARK_DRIVER_PORT=47707 \
SPARK_BLOCKMANAGER_PORT=39191

USER root

RUN wget --no-verbose -O apache-spark.tgz "${SPARK_DOWNLOAD_URL}" \
&& mkdir -p ${SPARK_HOME} \
&& tar -xf apache-spark.tgz -C ${SPARK_HOME} --strip-components=1 \
&& rm apache-spark.tgz \
&& apt update && apt -y install telnet net-tools iputils-ping

ADD ./zeppelin-env.sh ${ZEPPELIN_HOME}/conf/zeppelin-env.sh
ADD ./zeppelin-site.xml ${ZEPPELIN_HOME}/conf/zeppelin-site.xml

WORKDIR /opt/zeppelin

EXPOSE ${ZEPPELIN_PORT} ${SPARK_DRIVER_PORT} ${SPARK_BLOCKMANAGER_PORT}

CMD ["bin/zeppelin.sh"]