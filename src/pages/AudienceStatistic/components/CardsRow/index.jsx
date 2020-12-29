
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function CardsRow({ children, isMobile, className }) {
  return (
    <div className={cx('container', { mobile: isMobile }, className)}>
      {React.Children.map(children, (child, key) => (
        <div className={cx('card')} key={+key}>{child}</div>
      ))}
    </div>
  );
}

CardsRow.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};
