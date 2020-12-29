import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import OriginalStatus from 'components/common/OriginalStatus';

import commonStyles from 'styles/common.pcss';

const cx = classNames.bind(commonStyles);


/**
 * Same as status, but text is aligned by left side
 */
export default function Status({ children, emoji, isError, className, ...otherProps }) {
  return (
    <OriginalStatus
      {...otherProps}
      emoji={isError ? 'statusFail' : emoji}
      className={['attention', cx('baseColor', className)]}
    >
      <div className={cx('left')}>{children}</div>
    </OriginalStatus>
  );
}

Status.propTypes = {
  children: PropTypes.node,
  isError: PropTypes.bool,
  emoji: PropTypes.oneOf(['statusFail']),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  text: PropTypes.string,
};
