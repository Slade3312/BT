import React from 'react';
import PropTypes from 'prop-types';


export default function withOutsideClick(WrappedComponent) {
  class OutsideClickCaptor extends React.Component {
    componentDidMount = () => this.toggleEventListener();
    componentDidUpdate = () => this.toggleEventListener();
    componentWillUnmount = () => this.toggleEventListener(true);

    /**
     * doesn't matter what kind of function is onOutsideClick,
     * as long as it exists we keep event listener,
     * multiple attaching/detaching does not cause any issues, so it is perfectly okay to do
     */
    toggleEventListener(isForceDisabled) {
      const { onOutsideClick } = this.props;
      if (isForceDisabled || !onOutsideClick) {
        document.removeEventListener('click', this.handleOutsideClick, false);
      } else {
        document.addEventListener('click', this.handleOutsideClick, false);
      }
    }
    handleOutsideClick = (event) => {
      const { onOutsideClick } = this.props;
      if (document.body.contains(event.target) && this.node && !this.node.contains(event.target)) {
        onOutsideClick();
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          ref={(node) => { this.node = node; }}
        />
      );
    }
  }

  OutsideClickCaptor.propTypes = {
    ...WrappedComponent.propTypes,

    /** Adds onOutsideClick handler, component ref must point to the dom Node */
    onOutsideClick: PropTypes.func,
  };


  /**
   * Override component name by prepending `Toggleable~`
   * to make it look nice, for example: `ToggleableComponent`
   */
  if (process.env.NODE_ENV !== 'production') {
    const WrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || '';
    OutsideClickCaptor.displayName = `Toggleable${WrappedComponentName}`;
  }

  return OutsideClickCaptor;
}
