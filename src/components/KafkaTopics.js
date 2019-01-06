import Select from 'react-select';
import React, {Component} from 'react';
import ajax from 'axios';
import URLS from '../utils/Constansts'

class KafkaTopics extends Component {
  state = {
    options: []
  };

  handleChange = (select) => {
    ajax.get(URLS.psService('/consumer/') + select.value);
  };

  render() {
    return (
      <div>
        <Select onChange={this.handleChange} defaultOptions options={this.props.options}/>
      </div>
    );
  }
}

export default KafkaTopics;