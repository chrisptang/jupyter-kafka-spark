docker run -d -u $(id -u) -p 8280:8080 -v $PWD/zeppelin-notebook:/notebook \
-v $PWD/zeppelin-logs:/logs -v $PWD/log-received:/log-received -v $PWD/spark/:/opt/spark \
-e SPARK_HOME=/opt/spark -e ZEPPELIN_NOTEBOOK_DIR='/notebook' -e ZEPPELIN_LOG_DIR='/logs' \
-v $PWD/zeppelin-warehouse:/warehouse --name zeppelin apache/zeppelin:0.10.0