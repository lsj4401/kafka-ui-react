import React, {Component} from 'react';
import { Button, Container } from 'reactstrap';
import Websocket from 'react-websocket';
import ajax from 'axios';
import URLS from './utils/Constansts'
import Select from 'react-select';
import './App.css';

const options = [];

class App extends Component {
  zookeeperMessage = '';
  kafkaMessage = '';

  state = {
    selectedOption: null,
    kafkaMessage: '',
    zookeeperMessage: ''
  };



  handleData(data) {
    const message = JSON.parse(data);
    this.zookeeperMessage += message.zookeeperMessage || '';
    this.kafkaMessage += message.kafkaMessage || '';
    this.setState({
      kafkaMessage: this.kafkaMessage,
      zookeeperMessage: this.zookeeperMessage
    });
  }

  zookeeperStart = () => {
    ajax.get(URLS.psService('/zookeeperStart'))
  };
  kafkaStart = () => {
    ajax.get(URLS.psService('/kafkaStart'))
  };

  onKafkaChangeText(e) {
    this.setState({kafkaMessage: e.target.value});
  };

  onZookeeperChangeText(e) {
    this.setState({zookeeperMessage: e.target.value});
  };

  handleChange = (selectedOption) => {
    this.setState({selectedOption});
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const {selectedOption} = this.state;

    return (
      <Container>
        <Websocket url='ws://localhost:9090' onMessage={this.handleData.bind(this)}/>
        <div className={'col-12'}>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
        </div>
        <br/>
        <div className={'col-12'}>
          <Button className={'col-12'} onClick={this.zookeeperStart}>ZookeeperStart</Button>
          <textarea className={'col-12'} onChange={this.onZookeeperChangeText} value={this.state.zookeeperMessage}/>
        </div>
        <div className={'col-12'}>
          <Button className={'col-12'} onClick={this.kafkaStart}>KafkaStart</Button>
          <textarea className={'col-12'} onChange={this.onKafkaChangeText} value={this.state.kafkaMessage}/>
        </div>
      </Container>
    );
  }
}

export default App;
