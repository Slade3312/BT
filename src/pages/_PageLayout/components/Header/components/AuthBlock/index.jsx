import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { withToggle } from 'enhancers';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const closingDelay = 400;

class AuthBlock extends React.Component {
  handleOpen = () => {
    clearTimeout(this.timeout);
    this.props.onOpen();
  };

  handleClose = () => {
    if (!this.props.isOpen) return;
    this.timeout = setTimeout(() => this.props.onClose(), closingDelay);
  };

  handleClick = () => {
    clearTimeout(this.timeout);
    if (this.props.isOpen) this.props.onClose();
    else this.props.onOpen();
  };

  render() {
    const { renderComponent, isOpen, children, className } = this.props;

    return (
      <div
        className={cx('component', { opened: isOpen }, className)}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        onClick={this.handleClick}
      >
        <div className={cx('content')}>{children}</div>

        {renderComponent && renderComponent({ isOpen, onOpen: this.handleOpen, onClose: this.handleClose })}
      </div>
    );
  }
}

AuthBlock.propTypes = {
  children: PropTypes.node,
  renderComponent: PropTypes.func,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default withToggle(AuthBlock);
