import React from 'react';
import { inheritPropTypes } from 'utils/inherit-prop-types';

/** forwardRef while keeping propTypes and defaultProps */
export default function withForwardedRef(WrappedComponent) {
  const Component = React.forwardRef((props, ref) => (
    <WrappedComponent {...props} forwardedRef={ref || React.createRef()} />
  ));
  return inheritPropTypes(Component, WrappedComponent, { omit: ['forwardedRef'] });
}
