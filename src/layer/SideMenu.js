import React, {Component} from 'react';
import {Button, Row, Col} from "reactstrap";
import ajax from "axios";
import URLS from "../utils/Constansts";
import KafkaTopics from "../components/KafkaTopics";
import MessageInputSender from "../components/MessageInputSender";

class SideMenu extends Component {
  state = {
    options: []
  };

  componentDidMount() {
    ajax.get(URLS.psService('/init'))
      .then((res) => {
        this.setState({
          message: res.data
        })
      });
  }

  loadOptions = () => {
    ajax.get(URLS.psService('/listTopic'))
      .then((res) => {
        const topics = res.data.topics.split('\n');
        const options = topics.filter(value => value !== '').map(value => {
          return {value: value, label: value}
        });
        this.setState({options: options});
      })
      .catch(() => {
        this.setState({options: []});
      });
  };

  zookeeperStart = () => {
    ajax.get(URLS.psService('/zookeeperStart'));
  };
  kafkaStart = () => {
    ajax.get(URLS.psService('/kafkaStart'));
  };



  render() {
    return (
      <div>
        <Row onClick={this.loadOptions}>
          <Col sm={12} style={{ marginBottom: '1rem' }}>
            <MessageInputSender message={this.state.message} url={'/kafka-path'} buttonLabel={'SET'}/>
            <KafkaTopics options={this.state.options}/>
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ marginBottom: '1rem' }}>
            <Button className={'col-12'} onClick={this.zookeeperStart}>ZookeeperStart</Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} style={{ marginBottom: '1rem' }}>
            <Button className={'col-12'} onClick={this.kafkaStart}>KafkaStart</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SideMenu;