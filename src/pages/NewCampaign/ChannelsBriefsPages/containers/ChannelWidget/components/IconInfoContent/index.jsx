import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Icon from '../../Icon';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const IconInfoContent = ({ iconSlug, eventsName, isDisabled }) => (
  <div className={cx('component', isDisabled && styles.disabled)}>
    <Icon className={cx('icon')} slug={iconSlug} />
    <span className={cx('content')}>{eventsName}</span>
  </div>
);

IconInfoContent.propTypes = {
  iconSlug: PropTypes.string,
  eventsName: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default IconInfoContent;
