import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames/bind';
import { OutsideClickTracker } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function AuthPopup({ children, isOpen, onClose, className }) {
  return (
    <OutsideClickTracker onOutsideClick={isOpen ? onClose : null}>
      <CSSTransition
        in={isOpen}
        classNames={{ exit: cx('exit') }}
        timeout={200}
      >
        <div className={cx('component', { opened: isOpen }, className)}>{children}</div>
      </CSSTransition>
    </OutsideClickTracker>
  );
}

AuthPopup.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};
