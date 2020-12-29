import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ItemInfoLabel = ({ children }) => (
  <div className={cx('container')}>{children}</div>
);

ItemInfoLabel.propTypes = {
  children: PropTypes.node,
};

export default ItemInfoLabel;
