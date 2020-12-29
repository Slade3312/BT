import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Logo } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Header = ({ isMobile, logoHref }) => (
  <div className={cx('container', { mobile: isMobile })}>
    <div className={cx('component')}>
      <Logo isMobile={isMobile} href={logoHref} />
    </div>
  </div>
);

Header.propTypes = {
  isMobile: PropTypes.bool,
  logoHref: PropTypes.string,
};

export default Header;
