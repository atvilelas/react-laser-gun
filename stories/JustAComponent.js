import React, { Component } from 'react';

export default class JustAComponent extends Component {
  render() {
    console.log('child rendering');
    return <div>Just a component</div>;
  }
}
