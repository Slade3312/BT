import React from 'react';
import PropTypes from 'prop-types';

import { isNullOrUndefined } from '../utils/fn';
import withForwardedRef from './withForwardedRef';


/**
 * HOC forces default value to be used in place of null or undefined
 * Useful for components with array type
 */
export default function withDefaultValue(WrappedComponent) {
  function DefaultValue({
    value,
    forwardedRef,
    ...inheritedProps
  }) {
    return (
      <WrappedComponent
        {...inheritedProps}
        ref={forwardedRef}
        value={isNullOrUndefined(value) ? WrappedComponent.defaultProps.value : value}
      />
    );
  }

  DefaultValue.propTypes = {
    ...WrappedComponent.propTypes,
    value: PropTypes.any,
  };

  if (process.env.NODE_ENV !== 'production') {
    DefaultValue.displayName = 'DefaultValue';
  }

  return withForwardedRef(DefaultValue);
}
