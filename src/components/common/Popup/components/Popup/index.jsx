import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import GlobalIcon from '../../../GlobalIcon';

import FixedOverlay from '../FixedOverlay';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * Stateless popup layout with screen overlay
 * Appears by sliding down from top of the screen,
 * Content has adaptive indents both outside and inside
 */
export function PopupStateless({ children, opened, wide, onClose, className, hideCloseButton }) {
  return (
    <FixedOverlay isOpen={opened} onClose={onClose} className={cx('overlay')}>
      <div className={cx('component', className, { wide })}>
        <button className={cx('cross', 'popupCloseButton', { hideCloseButton })} onClick={onClose}>
          <GlobalIcon slug="crossThin" />
        </button>

        {children}
      </div>
    </FixedOverlay>
  );
}

PopupStateless.propTypes = {
  opened: PropTypes.bool,
  wide: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

/**
 * One-use popup, initially open, it can only be closed once and for good
 * For all other use cases, please refer to Stateless version
 */
export default class PopupDisposable extends Component {
  state = {
    isOpen: true,
  };

  handleClose = () => this.setState({ isOpen: false });

  render() {
    return <PopupStateless {...this.props} opened={this.state.isOpen} onClose={this.handleClose} />;
  }
}

PopupDisposable.propTypes = {
  wide: PropTypes.bool, // inheritedProps
  children: PropTypes.node, // inheritedProps
  className: PropTypes.string, // inheritedProps
};
