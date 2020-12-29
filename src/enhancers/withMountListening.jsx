import React from 'react';
import PropTypes from 'prop-types';

export default function withMountListening(WrappedComponent) {
  class Component extends React.Component {
    componentDidMount() {
      this.props.onMount();
    }
    render() {
      const { onMount, ...rest } = this.props;
      return <WrappedComponent {...rest} />;
    }
  }

  Component.propTypes = {
    ...WrappedComponent.propTypes,
    onMount: PropTypes.func,
  };

  return Component;
}
