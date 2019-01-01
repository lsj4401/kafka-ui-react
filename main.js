const {app, BrowserWindow} = require('electron');
const express = require('express');
// const bodyParser = require('body-parser');
const server = express();
// const path = require('path');
// server.use(express.static(path.join(__dirname, 'build')));
//
const {spawn} = require('child_process');
server.get('/process', function (req, res) {
  const zookeeper = spawn('./src/kafka/bin/zookeeper-server-start.sh', ['./src/kafka/config/zookeeper.properties']);
  zookeeper.stdout.on('data', function (data) {
    if (localWs !== null) {
      console.log(`${data}`);
      localWs.send(`${data}`);
    }
  });
  return res.send('ok');
});
//
// server.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
//
server.listen(process.env.PORT || 8080);

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 9090 });

// 연결이 수립되면 클라이언트에 메시지를 전송하고 클라이언트로부터의 메시지를 수신한다
let localWs = null;
wss.on("connection", function(ws) {
  localWs = ws;
  ws.send("Hello! I am a server.");
  ws.on("message", function(message) {
    console.log("Received: %s", message);
  });
});


let win = null;

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({width: 1000, height: 600});

  // Specify entry point
  win.loadURL('http://localhost:3000');

  // Show dev tools
  // Remove this line before distributing
  win.webContents.openDevTools();

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}


app.on('ready', function () {
  createWindow();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});