/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LaserGunWatcher from '@Components/LaserGunWatcher';

import { KEY_CODES } from '../constants';

export const machineDefaultThresholds = {
  batchThreshold: 400,
  detectionThreshold: 30
};

export const humanDefaultThresholds = {
  batchThreshold: 3000,
  detectionThreshold: 1000,
  pattern: {
    prefix: '###',
    suffix: '$$$'
  }
};

const getLaserGunProvider = Provider => class LaserGunProvider extends Component {
  static propTypes = {
    detectionMethod: PropTypes.oneOf(['timeout', 'pattern']),
    batchThreshold: PropTypes.number,
    detectionThreshold: PropTypes.number,
    pattern: PropTypes.shape({
      prefix: PropTypes.string,
      suffix: PropTypes.string
    }),
    ignoredElements: PropTypes.arrayOf(
      PropTypes.oneOfType(
        [PropTypes.instanceOf(HTMLElement), PropTypes.func]
      )
    )
  };

  static defaultProps = {
    detectionMethod: 'timeout',
    pattern: {
      prefix: null,
      suffix: null
    },
    ignoredElements: [],
    ...humanDefaultThresholds
  };

  state = {
    run: false
  };

  accumulators = {
    key: [],
    time: []
  };

  clocks = {
    batch: null,
    control: null
  };

  elements = {
    ignore: []
  };

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyup);
  }

  handleKeyup = (keyupEvent) => {
    const shouldBeIgnored = this.elements.ignore
      .some((possibleElement) => {
        const element = typeof possibleElement === 'function' ? possibleElement() : possibleElement;
        console.log(possibleElement());
        return keyupEvent.path.includes(element);
      });

    if (shouldBeIgnored || !KEY_CODES.includes(keyupEvent.keyCode)) {
      return;
    }

    if (this.clocks.batch !== null) {
      window.clearTimeout(this.clocks.batch);
      this.clocks.batch = null;
    }

    this.processTimeoutKey(keyupEvent.key);
    if (this.clocks.control !== null) {
      window.clearTimeout(this.clocks.control);
      this.clocks.control = null;
    }

    this.clocks.control = window.setTimeout(() => {
      console.log('next word');
    }, 900);

    this.clocks.batch = window.setTimeout(() => {
      this.processTimeoutBatch();
    }, this.props.batchThreshold);
  };

  processTimeoutKey = (key) => {
    this.accumulators.key.push(key);
    this.accumulators.time.push(window.performance.now());
  };

  processTimeoutBatch = () => {
    if (this.accumulators.key.length === 0) {
      return;
    }

    const workingTimerAccumulator = [...this.accumulators.time];
    const workingKeyAccumulator = [...this.accumulators.key];

    this.accumulators.key = [];
    this.accumulators.time = [];
    const batch = workingKeyAccumulator.reduce((batchAccumulator, key, index) => {
      const nextBatchAccumulator = [...batchAccumulator];
      if (index === 0) {
        nextBatchAccumulator.push([]);
      }

      const isWithinDetectionThreshold =
        index === 0 ||
        ((
          workingTimerAccumulator[index] - workingTimerAccumulator[index - 1]
        ) <= this.props.detectionThreshold);

      if (isWithinDetectionThreshold) {
        nextBatchAccumulator[nextBatchAccumulator.length - 1].push(key);
      } else {
        nextBatchAccumulator.push([key]);
      }

      return nextBatchAccumulator;
    }, []).map(item => item.join(''));

    console.log(batch);
  };

  processPatternBatch = () => {
    if (this.accumulators.key.length === 0) {
      return;
    }

    const workingKeyAccumulator = [...this.accumulators.key];

    this.accumulators.key = [];
    this.accumulators.time = [];
    const { pattern: { prefix, suffix } } = this.props;

    const falsyish = [undefined, null];
    const keyString = workingKeyAccumulator.join('');
    let stringArray = [keyString];
    if (!falsyish.includes(prefix) && falsyish.includes(suffix)) {
      stringArray = keyString.split(prefix);
    } else if (falsyish.includes(prefix) && !falsyish.includes(suffix)) {
      stringArray = keyString.split(suffix);
    } else if (!falsyish.includes(prefix) && !falsyish.includes(suffix)) {
      stringArray = keyString.split(suffix).map(item => (
        item.indexOf(prefix) === 0 ? item.replace(prefix, '') : item
      ));
    }

    console.log(stringArray);
  };

  setRef = (element) => {
    if (!element) {
      return;
    }
    this.element = element;
  };

  render() {
    console.log('provider rendered');
    const { children } = this.props;
    return (
      <Fragment>
        <LaserGunWatcher onUpdateState={this.handleUpdateState} />
        <textarea ref={this.setRef}></textarea>
        <Provider value={{
          ...this.state
        }}>
            {children}
        </Provider>
      </Fragment>
    );
  }
};

export default getLaserGunProvider;
