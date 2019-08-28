import React from 'react';

import getLaserGunProvider from '@Components/LaserGunProvider';
import getLaserGunConsumer from '@Components/LaserGunConsumer';

const getLaserGunParts = () => {
  const Context = React.createContext();
  Context.displayName = 'LaserGun';

  const { Provider, Consumer } = Context;
  const parts = {};
  parts.LaserGunProvider = getLaserGunProvider(Provider);
  parts.LaserGunProvider.displayName = 'LaserGunProvider';
  parts.LaserGunConsumer = getLaserGunConsumer(Consumer);
  parts.LaserGunConsumer.displayName = 'LaserGunConsumer';
  return parts;
};

const {
  LaserGunProvider,
  LaserGunConsumer
} = getLaserGunParts();

export {
  LaserGunProvider,
  LaserGunConsumer
};
