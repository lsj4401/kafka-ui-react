const express = require('express');
const http = require("http");
const app = express();
const cors = require('cors');
const {spawn, exec} = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

// const binUrl = path.join(__dirname, '/./kafka/bin/');

const server = http.createServer(app);
const socketIo = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

exports.init = function () {
  let binUrl = '/usr/local/kafka_2.11-2.1.0';
  let zookeeper = null;
  let consumer = null;
  let kafka = null;

  app.post('/kafka-path', function (req, res) {
    console.log(req.body.message);
    binUrl = req.body.message;
    return res.send('kafka-path : ' + binUrl);
  });

  app.get('/pwd', function (req, res) {
    exec('pwd', (err, stdout, stderr) => {
      if (err) {
        res.send(stdout);
      }
      res.send({topics: stdout});
    });
  });

  app.get('/zookeeperStart', function (req, res) {
    if (zookeeper !== null) {
      zookeeper.kill()
    }

    zookeeper = spawn(binUrl + '/bin/zookeeper-server-start.sh', [binUrl + '/config/zookeeper.properties']);
    zookeeper.stdout.on('data', function (data) {
      socketIo.emit('kafkaLog', `${data}`);
    });
    return res.send('ok');
  });

  app.get('/kafkaStart', function (req, res) {
    if (kafka !== null) {
      kafka.kill()
    }

    kafka = spawn(binUrl + '/bin/kafka-server-start.sh', [binUrl + '/config/server.properties']);
    kafka.stdout.on('data', function (data) {
      socketIo.emit('kafkaLog', `${data}`);
    });
    return res.send('ok');
  });


  app.get('/consumer/:topics', function (req, res) {
    if (consumer !== null) {
      consumer.kill();
    }
    consumer = spawn(binUrl + '/bin/kafka-console-consumer.sh', ['--bootstrap-server', 'localhost:9092', '--topic', req.params.topics, '--from-beginning']);
    consumer.stdout.on('data', function (data) {
      socketIo.emit('topicConsumer', `${data}`);
    });
    res.send('ok');
  });


  app.get('/listTopic', function (req, res) {
    exec(binUrl + '/bin/kafka-topics.sh --list --zookeeper localhost:2181', (err, stdout, stderr) => {
      if (err) {
        res.send(stdout);
      }
      res.send({topics: stdout});
    });
  });

  app.post('/send/:topics', function (req, res) {
    const message = spawn(binUrl + '/bin/kafka-console-producer.sh', ['--broker-list', 'localhost:9092', '--topic', req.params.topics]);
    message.stdout.on('data', function (data) {
      message.stdin.write(req.body.message);
      message.kill();
    })
  });

  server.listen(9999);
  socketIo.on("connection", socket => {
  });
};
