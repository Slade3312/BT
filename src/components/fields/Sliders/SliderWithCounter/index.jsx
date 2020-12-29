import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import SliderBase from './../SliderBase';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function SliderWithCounter({ value, ...otherProps }) {
  return (
    <div className={cx('component')}>
      <span className={cx('label')}>{value} ₽</span>

      <SliderBase value={value} className={cx('slider')} {...otherProps} />
    </div>
  );
}

SliderWithCounter.propTypes = {
  leftLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rightLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.number,
};

export default SliderWithCounter;
