import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import {
  MenuBar,
  MenuEntries,
  TopBar,
  TopBarPart,
} from './components';

import { LogoContainer, HelpLink, AuthContainer } from './containers';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Header = ({ className }) => (
  <header className={cx('component', className)}>
    <TopBar>
      <TopBarPart>
        <HelpLink />

        <AuthContainer />
      </TopBarPart>
    </TopBar>

    <MenuBar>
      <LogoContainer />

      <MenuEntries />
    </MenuBar>
  </header>
);

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
