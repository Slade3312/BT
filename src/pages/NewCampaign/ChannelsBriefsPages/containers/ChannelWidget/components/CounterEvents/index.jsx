import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { formatPrice } from 'utils/formatting';

import CounterRangeRow from './CounterRangeRow';
import CounterLine from './CounterLine';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function CounterEvents({ avg, min, max, isDisabled }) {
  const hasActualEventCounts = typeof avg === 'number' || typeof min === 'number' || typeof max === 'number';

  const renderEvents = () => {
    if (hasActualEventCounts) {
      if (min && !avg && !max) {
        return (
          <CounterRangeRow>
            <CounterLine isDisabled={isDisabled} isBig prefixText="от" value={min} />
          </CounterRangeRow>
        );
      }
      if (typeof avg === 'number') {
        return <span className={cx('price', 'big', isDisabled && styles.disabled)}>{formatPrice(avg)}</span>;
      }
      return (
        <CounterRangeRow>
          {min && <CounterLine isDisabled={isDisabled} prefixText="от" value={min} />}
          {max && <CounterLine isDisabled={isDisabled} prefixText="до" value={max} isSecond />}
        </CounterRangeRow>
      );
    }
    return <span className={cx('price', 'big', isDisabled && styles.disabled)}>0</span>;
  };

  return (
    <div className={cx('counterRow')}>
      {renderEvents()}
    </div>
  );
}

CounterEvents.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  avg: PropTypes.number,
  isDisabled: PropTypes.bool,
};

export default CounterEvents;
