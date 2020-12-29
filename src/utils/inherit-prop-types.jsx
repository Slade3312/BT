/* eslint-disable no-param-reassign */

import React from 'react';

/**
 * Copies propTypes from Ancestor to Component, omitting some of the params
 */
export const inheritPropTypes = (Component, Ancestor, { omit = [] } = {}) => {
  Component.propTypes = { ...Ancestor.propTypes };
  Component.defaultProps = { ...Ancestor.defaultProps };
  omit.forEach((propName) => {
    delete Component.propTypes[propName];
    delete Component.defaultProps[propName];
  });
  return Component;
};

/** forwardRef while keeping propTypes and defaultProps */
export const smartForwardRef = (WrappedComponent) => {
  const Component = React.forwardRef((props, ref) => (
    <WrappedComponent {...props} forwardedRef={ref || React.createRef()} />
  ));
  return inheritPropTypes(Component, WrappedComponent, { omit: ['forwardedRef'] });
};
