import React from 'react';
import Exception from './index';

export default class Exception403 extends React.PureComponent {
  state = {
    systemList: []
  }
  componentDidMount() {
    const systemList = localStorage.getItem('systemList') ? JSON.parse(localStorage.getItem('systemList')) : [];
    this.setState({ systemList });
  }
  render() {
    return <Exception type="403" systemList={this.state.systemList} img={require('../../assets/error-403.png')} style={{ minHeight: 500, height: '80%' }} />
  }
}