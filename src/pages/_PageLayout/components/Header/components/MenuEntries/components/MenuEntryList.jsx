import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function MenuEntryList({ children }) {
  return (
    <div className={cx('container')}>
      <div className={cx('containerIn')}>
        {children}
      </div>
    </div>
  );
}


MenuEntryList.propTypes = {
  children: PropTypes.node,
};
