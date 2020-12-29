import React from 'react';
import PropTypes from 'prop-types';


/**
 * Modifies onClick and onMouseDown seamlessly so that `onClick` only fires
 * if there was prior onMouseDown on the same element
 */
export default function withSafeClick(WrappedComponent) {
  class WithSafeClick extends React.Component {
    handleMouseDown = (...args) => {
      const { onMouseDown } = this.props;
      this.allowClick = true;
      if (onMouseDown) onMouseDown(...args);
      document.addEventListener('mouseup', this.handleMouseUp);
    };
    handleMouseUp = () => {
      setTimeout(() => { this.allowClick = false; });
      document.removeEventListener('mouseup', this.handleMouseUp);
    };
    handleClick = (...args) => {
      const { onClick } = this.props;
      if (this.allowClick) onClick(...args);
    };
    render() {
      const { onClick } = this.props;
      return (
        <WrappedComponent
          {...this.props}
          {...onClick ? {
            onMouseDown: this.handleMouseDown,
            onClick: this.handleClick,
          } : {}}
        />
      );
    }
  }

  WithSafeClick.propTypes = {
    ...WrappedComponent.propTypes,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
  };

  return WithSafeClick;
}
