import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Separator = ({ isTransparent }) => <div className={cx('separator', { hidden: isTransparent })} />;

Separator.propTypes = {
  isTransparent: PropTypes.bool,
};

export default Separator;
