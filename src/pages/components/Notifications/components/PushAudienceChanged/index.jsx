import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles.pcss';

const cx = classNames.bind(styles);

export default function PushAudienceChanged({ onClick, title, description }) {
  return (
    <div className={cx('notificationContainer')} onClick={onClick} key="android">
      <h2 className={cx('title')}>{title}</h2>

      <h4 className={cx('description')}>
        {description}
      </h4>
    </div>
  );
}


PushAudienceChanged.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  onClick: PropTypes.func,
};
