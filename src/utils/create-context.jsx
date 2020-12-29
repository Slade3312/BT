import React from 'react';
import { connect } from 'react-redux';


/**
 * like defaultMergeProps, but only passing down children from ownProps
 */
function defaultMergeContext(stateProps, dispatchProps, { children }) {
  return { children, ...stateProps, ...dispatchProps };
}

/**
 * Extended React.createContext factory returns Provider, Consumer unmodified,
 * and adds extra withContext function on top of normal Provider and consumer
 *
 * Returns object with three renamed context, see return statement for clarification
 *
 * Usage:
 * export const {Provider, Consumer, withContext, connectContext} = CreateContext();
 */
export default function createContext(...args) {
  const { Provider, Consumer } = React.createContext(...args);

  /**
   * HOC that takes contextToProps method to transform
   * contextToProps arguments are: context, ownProps
   */
  const withContext = mapContextToProps => (
    (WrappedComponent) => {
      const ConnectedConsumer = props => (
        <Consumer>
          {context => (
            <WrappedComponent {...props} {...mapContextToProps ? mapContextToProps(context, props) : context} />
          )}
        </Consumer>
      );

      /**
       * Override Connector's name to with%Name%Context(%Component%)
       */
      if (process.env.NODE_ENV !== 'production') {
        const WrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        ConnectedConsumer.displayName = `withContext(${WrappedComponentName})`;
      }
      return ConnectedConsumer;
    }
  );

  /**
   * HOC extension to react-redux connect, has all similar arguments to normal connector,
   * Differences in behavior:
   * - it passes all the connected props to context rather than component,
   * - it does not pass ownProps to context, unless mergeContext defines so
   * - underlying WrappedComponent only receives ownProps
   */
  const connectContext = (mapStateToContext, mapDispatchToContext, mergeContext = defaultMergeContext, options) => (
    (WrappedComponent) => {
      /** We connect context Provider passing state and dispatchers, but not own props,
       * all the resulting props are passed into provider as `value` */

      /** Forced to add yet another empty wrapper because React Provider is not a function, it is an object */
      const ContextConnector = props => <Provider value={props}>{props.children}</Provider>; // eslint-disable-line

      const ConnectedProvider = connect(
        mapStateToContext,
        mapDispatchToContext,
        mergeContext,
        options,
      )(ContextConnector);

      /** Then wrap context Provider, so we can pass props down to wrapped component without changes */
      const ConnectedComponent = props => (
        <ConnectedProvider {...props}>
          <WrappedComponent {...props} />
        </ConnectedProvider>
      );

      /** Override Connector's name to with%Name%Context(%Component%) */
      if (process.env.NODE_ENV !== 'production') {
        const WrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        WrappedComponent.displayName = WrappedComponentName;
        ConnectedComponent.displayName = `connectContext(${WrappedComponentName})`;
      }
      return ConnectedComponent;
    }
  );

  return {
    Provider,
    Consumer,
    withContext,
    connectContext,
  };
}
