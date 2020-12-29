import React from 'react';
import { isValidElementType } from 'react-is';
import { filter } from './fn';

// Дорогой друг, если у тебя есть время и желание,
//   пожалуйста, убей это дерьмо

/**
 * Wraps parametrized HOC function allowing to call it both with param, or without it, as follows:
 * - HOC(params)(WrappedComponent)
 * - HOC(WrappedComponents)
 */
export const allowParamOmit = HOC =>
  arg => (isValidElementType(arg) ? HOC()(arg) : HOC(arg));


/**
 * Wraps component by passing:
 * `finalProps` that can no longer be changed and
 * `defaultProps` that can be overridden
 */
export const defineProps = (finalProps, defaultProps) =>
  (WrappedComponent) => {
    const RedefinedComponent = props => (
      <WrappedComponent
        {...defaultProps}
        {...props}
        {...finalProps}
      />
    );

    if (process.env.NODE_ENV !== 'production') {
      RedefinedComponent.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
      RedefinedComponent.propTypes = {
        ...filter(WrappedComponent.propTypes, (_, propName) => !(propName in (finalProps || {}))),
      };
    }

    return RedefinedComponent;
  };

const __SecretPrevProps = '__prevRenderProps';

/**
 * Wrapper around getDerivedStateFromProps to only react on props change and ignore setState calls
 */
export const ignoreState = getDerivedStateFromProps => (nextProps, prevState) => {
  if (prevState[__SecretPrevProps] !== nextProps) {
    return {
      ...getDerivedStateFromProps(nextProps, prevState),
      [__SecretPrevProps]: nextProps,
    };
  }
  return null;
};
