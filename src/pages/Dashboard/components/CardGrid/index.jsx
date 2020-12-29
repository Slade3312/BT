
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import sharedStyles from '../../shared.pcss';
import styles from './styles.pcss';

const cx = classNames.bind({ ...sharedStyles, ...styles });

export default function CardGrid({ children, isMobile, className }) {
  return (
    <div className={className}>
      <div className={cx('container', 'marg-cards', { mobile: isMobile })}>
        {React.Children.map(children, (child, key) => (
          <div className={cx('card', 'padd-card')} key={+key}>{child}</div>
        ))}
      </div>
    </div>
  );
}

CardGrid.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};
