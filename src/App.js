import React, {Component} from 'react';
import Websocket from 'react-websocket';
import './App.css';

class App extends Component {
  zookeeperMessage = '';

  state = {
    message: ''
  };

  handleData(data) {
    this.zookeeperMessage += data + '\n';
    this.setState({
      message: this.zookeeperMessage
    });
  }

  zookeeperStart = () => {};
  kafkaStart = () => {};

  render() {
    return (
      <div className="App">
        <Websocket url='ws://localhost:9090' onMessage={this.handleData.bind(this)}/>
        <header className="App-header">
          <button onClick={this.zookeeperStart}>ZookeeperStart</button>
          <textarea value={this.state.message} />

          <button onClick={this.kafkaStart}>KafkaStart</button>
          <textarea value={this.state.message} />
        </header>
      </div>
    );
  }
}

export default App;
