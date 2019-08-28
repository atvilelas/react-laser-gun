/* eslint-disable react/prop-types */
/* eslint-disable arrow-parens */
/* eslint-disable react/display-name */
import React, { Component } from 'react';

export default class LaserGunWatcher extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log('Watcher', this.props);
    return <div>Watcher</div>;
  }
}
