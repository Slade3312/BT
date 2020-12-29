import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { Link } from '@reach/router';
import { getHasBlockingError } from 'store/common/errorInfo/selectors';
import LogoB2B from './LogoB2B';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function Logo({ href, isMobile, className }) {
  const hasBlockingError = useSelector(getHasBlockingError);

  const handleClick = (e) => {
    if (hasBlockingError) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <Link className={cx('component', className)} onClick={handleClick} to={href}>
      <LogoB2B isMobile={isMobile} className={cx('logoImage')} />
    </Link>
  );
}

Logo.propTypes = {
  href: PropTypes.string,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};
