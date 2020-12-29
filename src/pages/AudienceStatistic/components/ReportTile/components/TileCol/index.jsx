import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const types = {
  date: Symbol('date'),
  dateBody: Symbol('date-body'),
  status: Symbol('status'),
  statusBody: Symbol('status-body'),
  name: Symbol('name'),
  search: Symbol('search'),
  last: Symbol('last'),
  lastBody: Symbol('last-body'),
};

export default function TileCol({ children, className, hasOverflow, type, isLimited, column, isBright }) {
  return (
    <div
      className={cx(
        'col',
        {
          overflow: hasOverflow,
          dateCol: type === types.date,
          searchCol: type === types.search,
          statusCol: type === types.status,
          statusBodyCol: type === types.statusBody,
          dateBodyCol: type === types.dateBody,
          lastCol: type === types.last,
          lastBody: type === types.lastBody,
          limited: isLimited,
          bright: isBright,
          column,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

TileCol.propConstants = {
  types,
};

TileCol.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hasOverflow: PropTypes.bool,
  isBright: PropTypes.bool,
  type: PropTypes.symbol,
  isLimited: PropTypes.bool,
  column: PropTypes.bool,
};
