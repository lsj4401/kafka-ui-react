import React, {Component} from 'react';
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import ajax from "axios";
import URLS from "../utils/Constansts";

class KafkaMessageSender extends Component {
  state = {
    message: ''
  };

  sendMessage = () => {
    ajax.post(URLS.psService('/send/'), {
      message: this.state.message
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    }).then((res) => {
    })
  };

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  render() {
    return (
      <div>
        <InputGroup>
          <Input value={this.state.message} onChange={this.handleChange}/>
          <InputGroupAddon addonType="append"><Button onClick={this.sendMessage}>Send</Button></InputGroupAddon>
        </InputGroup>
      </div>
    )
  }
}

export default KafkaMessageSender;