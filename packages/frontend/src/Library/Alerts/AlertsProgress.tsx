import { AlertTypes } from '@platonist/library';
import React, { Component } from 'react';
import { Progress } from 'reactstrap';

export interface AlertsProgressProps {
  done?: () => void;
  type: AlertTypes;
}

export interface AlertsProgressState {
  count: number;
  intervalId?: NodeJS.Timeout | number;
}

export class AlertsProgress extends Component<
  AlertsProgressProps,
  AlertsProgressState
> {
  constructor(props: AlertsProgressProps) {
    super(props);

    this.state = {
      count: 100,
    };

    this.timer = this.timer.bind(this);
  }

  componentDidMount() {
    const intervalId = setInterval(this.timer, 80);
    // store intervalId in the state so it can be accessed later:
    this.setState({
      intervalId: intervalId,
    });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId as number);
  }

  private timer() {
    const newCount = this.state.count - 1;

    if (newCount >= 0) {
      this.setState({
        count: newCount,
      });
    } else {
      clearInterval(this.state.intervalId as number);
      const callBack = () => {
        if (this.props.done) {
          this.props.done();
        }
      };
      setTimeout(callBack, 100);
    }
  }

  render() {
    return (
      <Progress
        animated={true}
        color={this.props.type}
        value={(this.state.count - 100) * -1}
      />
    );
  }
}
