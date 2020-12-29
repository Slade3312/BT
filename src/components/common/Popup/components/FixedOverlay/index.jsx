import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { isEscapePressed } from 'utils/eventKeys';
import { togglePageFix } from 'utils/scrollFixer';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

/**
 * FixedOverlay is a stateless component with no layout
 * it provides open/close mechanics with scroll fixing
 * automatically closes on pressing Escape if onClose is passed
 *
 * Used as root component for custom Popup implementations
 */
export default class FixedOverlay extends React.Component {
  componentDidMount = () => this.togglePageFix(this.props.isOpen);

  componentDidUpdate = () => this.togglePageFix(this.props.isOpen);

  componentWillUnmount = () => this.togglePageFix(false);
  /**
   * isFixed is not state, because it controls sideEffect
   * it syncs with this.props.isOpen
   */
  isFixed = false;
  /**
   * to fix an issue with popup closing, when user clicks
   * on an element inside popup and moves mouse outside
   * we keep track of what element was clicked before
   */
  closeTargetMismatch = false;

  /**
   * Wrapper around togglePageFix, only fires if value changes
   */
  togglePageFix(isOpen) {
    if (isOpen !== this.isFixed) {
      this.isFixed = isOpen;
      if (isOpen && this.props.onClose) {
        document.addEventListener('keydown', this.handleEscapeKey);
      } else {
        document.removeEventListener('keydown', this.handleEscapeKey);
      }
      togglePageFix(isOpen);
    }
  }

  handleEscapeKey = (event) => {
    if (isEscapePressed(event)) this.props.onClose();
  };

  handleContainerClick = (event) => {
    if (event.target === event.currentTarget && !this.closeTargetMismatch) this.props.onClose();
    this.closeTargetMismatch = false;
  };

  handleContainerMouseDown = (event) => {
    this.closeTargetMismatch = event.target !== event.currentTarget;
  };

  render() {
    const { children, isOpen, className } = this.props;
    return isOpen ? (
      <div
        className={cx('component', className)}
        onClick={this.handleContainerClick}
        onMouseDown={this.handleContainerMouseDown}
        role="presentation"
      >
        {children}
      </div>
    ) : null;
  }
}

FixedOverlay.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

FixedOverlay.defaultProps = {
  isOpen: false,
};
