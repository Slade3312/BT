import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });

const types = {
  date: Symbol('date'),
  status: Symbol('status'),
  channel: Symbol('channel'),
  name: Symbol('name'),
  right: Symbol('right'),
};

export default function ColumnCell({ children, type, className }) {
  return (
    <div
      className={cx('component', {
        dateCol: type === types.date,
        nameCol: type === types.name,
        statusCol: type === types.status,
        channelCol: type === types.channel,
        rightCol: type === types.right,
      }, className)}
    >
      {children}
    </div>
  );
}

ColumnCell.propConstants = {
  types,
};

ColumnCell.propTypes = {
  children: PropTypes.node,
  type: PropTypes.symbol,
  className: PropTypes.string,
};
