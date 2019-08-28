import React from 'react';
import { storiesOf } from '@storybook/react';
import { LaserGunProvider } from '../dist/index';
import JustAComponent from './JustAComponent';
import AnotherComponent from './AnotherComponent';

console.log(LaserGunProvider);
storiesOf('LaserGun', module)
  .add('with text', () => (
    <div>Hello Button</div>
  ))
  .add('with emoji', () => {
    return (
      <LaserGunProvider>
        Placeholder
        <JustAComponent />
        <AnotherComponent />
      </LaserGunProvider>
    );
  });
