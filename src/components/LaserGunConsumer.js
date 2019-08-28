/* eslint-disable arrow-parens */
/* eslint-disable react/display-name */
import React from 'react';
import LaserGunReader from '@Components/LaserGunReader';

const getLaserGunConsumer = Consumer => props => (
  <Consumer>
    {providerProps => <LaserGunReader {...props} {...providerProps} />}
  </Consumer>
);

export default getLaserGunConsumer;
