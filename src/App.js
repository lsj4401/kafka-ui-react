import React, {Component} from 'react';
import {Col, Container, Row} from 'reactstrap';
import MessageReceiverConsole from './components/MessageReceiverConsole'
import SideMenu from "./layer/SideMenu";
import './App.css';
import MessageInputSender from "./components/MessageInputSender";

class App extends Component {

  state = {
    kafkaLog: '',
    topicConsumer: ''
  };

  render() {
    return (
      <Container>
        <Row>
          <Col sm={12} style={{backgroundColor: '#3c3f41', marginTop: '10px'}}>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <SideMenu/>
          </Col>
          <Col sm={8}>
            <div>
              <MessageInputSender />
              <MessageReceiverConsole size={12} receiveMessageName='topicConsumer' />
              <MessageReceiverConsole size={5} receiveMessageName='kafkaLog' />
            </div>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default App;
