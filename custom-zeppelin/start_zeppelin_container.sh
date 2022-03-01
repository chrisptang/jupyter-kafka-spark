# 需要先下载spark 二进制文件，参考：
# SPARK_DOWNLOAD_URL=https://dlcdn.apache.org/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz
# SPARK_HOME=$PWD/spark
# wget --no-verbose -O apache-spark.tgz "${SPARK_DOWNLOAD_URL}" \
# && mkdir -p ${SPARK_HOME} \
# && tar -xf apache-spark.tgz -C ${SPARK_HOME} --strip-components=1 \
# && rm apache-spark.tgz

# forward spark.driver.port=47077
# forward spark.blockManager.port=39191

docker run -d -u $(id -u) -p 8280:8080 -p 47077:47077 -p 39191:39191 -v $PWD/zeppelin-notebook:/notebook \
-v $PWD/zeppelin-logs:/logs -v $PWD/log-received:/log-received -v $PWD/spark/:/opt/spark \
-e SPARK_HOME=/opt/spark -e ZEPPELIN_NOTEBOOK_DIR='/notebook' -e ZEPPELIN_LOG_DIR='/logs' \
-v $PWD/zeppelin-warehouse:/warehouse --name zeppelin apache/zeppelin:0.10.0