import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

export default function ColumnCell({ children, type, className }) {
  return (
    <div
      className={cx('component', {
        dateCol: type === 'date',
        nameCol: type === 'name',
        statusCol: type === 'status',
        channelCol: type === 'channel',
        rightCol: type === 'right',
      }, className)}
    >
      {children}
    </div>
  );
}

ColumnCell.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  className: PropTypes.string,
};
