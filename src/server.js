const log = require('electron-log');
const express = require('express');
const http = require("http");
const app = express();
const cors = require('cors');
const {spawn, exec} = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const binUrl = path.join(__dirname, '/./kafka/bin/');

const server = http.createServer(app);
const socketIo = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

exports.init = function () {
  let binUrl = '';
  let zookeeper = null;
  let consumer = null;
  let kafka = null;
  const propertiesPath = '/tmp/kafka-ui-properties';

  app.use((req, res, next) => {
    // res.end(req.url);
    // if (binUrl === '' && req.url !== '/kafka-path') {
    //   console.log('url not set');
    //   res.send('url is not set');
    // } else {
      next();
    // }
  });

  app.get('/init', (req, res) => {
    log.info('init');
    if (!fs.existsSync(propertiesPath)) {
      log.info('file not exist');
      return res.send('');
    }

    const readline = require('readline');
    const inputStream = fs.createReadStream(propertiesPath);
    // const outputStream = new (require('stream'))();
    const rl = readline.createInterface(inputStream); //, outputStream);

    rl.on('line', function (line) {
      binUrl = line;
      res.send(line);
    });

    rl.on('close', function (line) {
    });
  });

  app.post('/kafka-path', (req, res) => {
    binUrl = req.body.message;
    fs.writeFile(propertiesPath, binUrl, function (err) {
      if (err) {
        log.error(err);
      }
    });
    res.send('ok');
  });

  app.get('/pwd', (req, res) => {
    exec('pwd', (err, stdout, stderr) => {
      if (err) {
        res.send(stdout);
      }
      res.send({topics: stdout});
    });
  });

  app.get('/zookeeperStart', (req, res) => {
    if (zookeeper !== null) {
      zookeeper.kill()
    }
    const executePath = binUrl + '/bin/zookeeper-server-start.sh';
    if (fs.existsSync(executePath)) {
      zookeeper = spawn(executePath, [binUrl + '/config/zookeeper.properties']);
      zookeeper.stdout.on('data', function (data) {
        socketIo.emit('kafkaLog', `${data}`);
      });
    }
    return res.send('ok');
  });

  app.get('/kafkaStart', function (req, res) {
    if (kafka !== null) {
      kafka.kill()
    }
    const executePath = binUrl + '/bin/kafka-server-start.sh';
    if (fs.existsSync(executePath)) {
      kafka = spawn(executePath, [binUrl + '/config/server.properties']);
      kafka.stdout.on('data', function (data) {
        socketIo.emit('kafkaLog', `${data}`);
      });
    }
    return res.send('ok');
  });


  app.get('/consumer/:topics', function (req, res) {
    if (consumer !== null) {
      consumer.kill();
    }

    const executePath = binUrl + '/bin/kafka-console-consumer.sh';
    if (fs.existsSync(executePath)) {
      consumer = spawn(executePath, ['--bootstrap-server', 'localhost:9092', '--topic', req.params.topics, '--from-beginning']);
      consumer.stdout.on('data', function (data) {
        socketIo.emit('topicConsumer', `${data}`);
      });
    }
    res.send('ok');
  });

  app.get('/listTopic', function (req, res) {
    const executePath = binUrl + '/bin/kafka-topics.sh';
    if (fs.existsSync(executePath)) {
      exec(executePath + ' --list --zookeeper localhost:2181', (err, stdout, stderr) => {
        if (err) {
          res.send(stdout);
        }
        res.send({topics: stdout});
      });
    } else {
      res.send('ok');
    }
  });

  app.post('/send/:topics', function (req, res) {
    const executePath = binUrl + '/bin/kafka-console-producer.sh';
    if (fs.existsSync(executePath)) {
      const message = spawn(executePath, ['--broker-list', 'localhost:9092', '--topic', req.params.topics]);
      message.stdout.on('data', function (data) {
        message.stdin.write(req.body.message);
        message.kill();
      })
    } else {
      res.send('ok');
    }
  });

  server.listen(9999);
  socketIo.on("connection", socket => {
  });
};
