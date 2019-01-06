const express = require('express');
const http = require("http");
// const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
const {spawn, exec} = require('child_process');
const binUrl = './src/kafka/bin/';
const server = http.createServer(app);
const socketIo = require("socket.io")(server);

exports.init = function () {
  let zookeeper = null;
  let consumer = null;
  let kafka = null;
  app.get('/zookeeperStart', function (req, res) {
    if (zookeeper !== null) {
      zookeeper.kill()
    }

    zookeeper = spawn(binUrl + 'zookeeper-server-start.sh', ['./src/kafka/config/zookeeper.properties']);
    zookeeper.stdout.on('data', function (data) {
      socketIo.emit('kafkaLog', `${data}`);
    });
    return res.send('ok');
  });

  app.get('/kafkaStart', function (req, res) {
    if (kafka !== null) {
      kafka.kill()
    }

    kafka = spawn(binUrl + 'kafka-server-start.sh', ['./src/kafka/config/server.properties']);
    kafka.stdout.on('data', function (data) {
      socketIo.emit('kafkaLog', `${data}`);
    });
    return res.send('ok');
  });


  app.get('/consumer/:topics', function (req, res) {
    if (consumer !== null) {
      consumer.kill();
    }
    consumer = spawn(binUrl + 'kafka-console-consumer.sh', ['--bootstrap-server', 'localhost:9092', '--topic', req.params.topics, '--from-beginning']);
    consumer.stdout.on('data', function (data) {
      socketIo.emit('topicConsumer', `${data}`);
    });
    res.send('ok');
  });


  app.get('/listTopic', function (req, res) {
    exec(binUrl + 'kafka-topics.sh --list --zookeeper localhost:2181', (err, stdout, stderr) => {
      if (err) {
        res.send(stdout);
      }
      res.send({topics: stdout});
    });
  });

  app.post('/send/:topics', function (req, res) {
    const message = spawn(binUrl + 'kafka-console-producer.sh', ['--broker-list', 'localhost:9092', '--topic', req.params.topics]);
    message.stdout.on('data', function (data) {
      message.stdin.write(req.body.message);
      message.kill();
    })
  });

  server.listen(9999);
  socketIo.on("connection", socket => {});
};
