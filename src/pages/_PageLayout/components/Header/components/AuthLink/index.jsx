import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from '@reach/router';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function AuthLink({ href, children, className, ...otherAttributes }) {
  return (
    <Link
      to={href || ''}
      className={cx('component', className)}
      {...otherAttributes}
    >
      {children}
    </Link>
  );
}

AuthLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
