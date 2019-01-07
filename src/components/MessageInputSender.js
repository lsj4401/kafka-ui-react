import React, {Component} from 'react';
import {Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import ajax from "axios";
import URLS from "../utils/Constansts";

class MessageInputSender extends Component {
  static defaultProps = {
    buttonLabel: 'send'
  };
  urlPath = '';
  state = {
    message: ''
  };

  componentDidMount() {
    this.urlPath = this.props.url;
  }

  sendMessage = () => {
    ajax.post(URLS.psService(this.urlPath), {
      message: this.state.message
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    }).then((res) => {
      // alert(res.data);
    })
  };

  handleChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  render() {
    return (
      <div>
        <InputGroup>
          <Input value={this.state.message} onChange={this.handleChange.bind(this)}/>
          <InputGroupAddon addonType="append"><Button onClick={this.sendMessage}>{this.props.buttonLabel}</Button></InputGroupAddon>
        </InputGroup>
      </div>
    )
  }
}

export default MessageInputSender;