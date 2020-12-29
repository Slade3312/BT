import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function OptionsList({ children }) {
  return (
    <div className={cx('container')}>
      {children}
    </div>
  );
}

OptionsList.propTypes = {
  children: PropTypes.node,
};
