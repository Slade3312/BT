import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { GlobalIcon, OutsideClickTracker } from 'components/common';

import { withToggle } from 'enhancers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


/**
 * Must be Wrapped and extended via withToggle() before use
 */
function StepSelect({ label, children, isOpen, onOpen, onClose, className }) {
  return (
    <OutsideClickTracker
      onOutsideClick={isOpen ? onClose : null}
      className={cx('component', { opened: isOpen }, className)}
    >
      <div className={cx('value')} onClick={isOpen ? onClose : onOpen}>
        {label}
        <GlobalIcon slug="dropdownArrow" className={cx('arrow')} />
      </div>
      {isOpen && (
        <div className={cx('content')}>
          {children}
        </div>
      )}
    </OutsideClickTracker>
  );
}

StepSelect.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,

  /** these fields are used by withToggle */
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default withToggle(StepSelect);
