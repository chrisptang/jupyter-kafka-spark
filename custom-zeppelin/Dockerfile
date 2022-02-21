FROM apache/zeppelin:0.10.0

ENV SPARK_DOWNLOAD_URL=https://dlcdn.apache.org/spark/spark-3.2.1/spark-3.2.1-bin-hadoop3.2.tgz

RUN wget --no-verbose -O apache-spark.tgz "${SPARK_DOWNLOAD_URL}" \
&& mkdir -p /opt/spark \
&& tar -xf apache-spark.tgz -C /opt/spark --strip-components=1 \
&& rm apache-spark.tgz

WORKDIR /opt/zeppelin

CMD ["bin/zeppelin.sh"]