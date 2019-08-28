import React, { Component } from 'react';
import { LaserGunConsumer } from '../dist/index';

export default class AnotherComponent extends Component {
  render() {
    console.log('another child rendering');
    return (
      <div>
        <LaserGunConsumer />
        <span>Just anoter component</span>
      </div>
    );
  }
}
