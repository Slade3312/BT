import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from '../../common/GlobalIcon';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function PhoneInfo({ children, className }) {
  return (
    <div className={cx('component', className)}>
      <span className={cx('text')}>
        <GlobalIcon className={cx('icon')} slug="phone" />
        {children}
      </span>
    </div>
  );
}

PhoneInfo.propTypes = {
  children: PropTypes.node,
  className: PropTypes.node,
};
