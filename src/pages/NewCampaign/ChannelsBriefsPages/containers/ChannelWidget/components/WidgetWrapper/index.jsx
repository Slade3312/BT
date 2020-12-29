import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { preventDefault } from 'utils/events';

import { withSafeClick } from 'enhancers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const WidgetWrapper = ({ children, onClick, onMouseDown }) => {
  const handleMouseDown = (e) => {
    preventDefault(e);
    onMouseDown(e);
  };
  return (
    <div
      className={cx('wrapper')}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

WidgetWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
};

export default withSafeClick(WidgetWrapper);
