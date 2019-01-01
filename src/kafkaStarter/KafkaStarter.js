import exec from 'child_process';
import React, {Component} from 'react';

class KafkaStarter extends Component {
    kafkaStat = exec("ls", (error, stdout, stderr) => {

    });

    render() {
        return (
            <div>

            </div>
        );
    }
}