import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Background({ image, color, type, className }) {
  return (
    <div
      style={{
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundColor: color || 'transparent',
      }}
      className={cx('image', type, className)}
    />
  );
}

Background.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};
