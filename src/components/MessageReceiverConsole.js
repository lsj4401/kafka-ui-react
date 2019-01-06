import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {Label} from "reactstrap";
import socketIOClient from "socket.io-client";
import URLS from "../utils/Constansts";

class MessageReceiverConsole extends Component {
  state = {
    message: ''
  };

  message = '';
  console = null;

  componentDidMount() {
    const socket = socketIOClient(URLS.psService(''));
    socket.on(this.props.receiveMessageName, data => {
      this.message += data;
      this.setState({message: this.message});
      const consumeConsole = ReactDOM.findDOMNode(this.console);
      if (consumeConsole) {
        consumeConsole.scrollTop = consumeConsole.scrollHeight;
      }
    });
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  render() {
    return (
      <div>
        <Label>Kafka Console Log</Label>
        <textarea rows={this.props.size} className={'col-12'} ref={console => this.console = console}
                  onChange={this.handleChange}
                  value={this.state.message}/>
      </div>
    )
  }
}

export default MessageReceiverConsole;