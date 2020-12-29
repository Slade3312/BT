import React from 'react';

export const withContext = (Context, mapContextToProps) => (
  (WrappedComponent) => {
    const ConnectedConsumer = props => (
      <Context.Consumer>
        {context => (
          <WrappedComponent {...props} {...mapContextToProps ? mapContextToProps(context, props) : context} />
        )}
      </Context.Consumer>
    );

    /**
     * Override Connector's name to withContext(%Component%)
     */
    if (process.env.NODE_ENV !== 'production') {
      const WrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
      ConnectedConsumer.displayName = `withContext(${WrappedComponentName})`;
    }
    return ConnectedConsumer;
  }
);
