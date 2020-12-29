import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { GlobalIcon } from 'components/common';

import { withToggle } from 'enhancers';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const HamburgerRaw = withToggle(({ className, render, isOpen, onOpen, onClose }) => (
  <React.Fragment>
    <button
      className={cx('button', className)}
      onClick={onOpen}
    >
      <GlobalIcon slug="burger" />
    </button>
    {render && render({ isOpen, onOpen, onClose })}
  </React.Fragment>
));

HamburgerRaw.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  render: PropTypes.func,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default HamburgerRaw;
