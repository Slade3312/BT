import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Fixed width wrapper to limit content width
 */
export default function Wrapper({ children, Content = 'div', className, ...otherAttributes }) {
  return (
    <div className={cx('container', className)} {...otherAttributes}>
      <Content className={cx('component')}>
        {children}
      </Content>
    </div>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node,
  Content: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.string,
};
