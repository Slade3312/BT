import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { getFormattedNewDate } from 'pages/Dashboard/components/UserInfoCard/helpers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function CurrentDate({ className }) {
  return <div className={cx('date', className)}>{getFormattedNewDate()}</div>;
}

CurrentDate.propTypes = {
  className: PropTypes.string,
};
