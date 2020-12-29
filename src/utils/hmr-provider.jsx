import { hot } from 'react-hot-loader/root';
import Redbox from 'utils/redbox-react';

/**
 * HOC that provides
 * HotModuleReload + ErrorBoundary
 * the actual highest parental module must be passed for HMR to work
 */

export const withHMR = (WrappedComponent) => {
  if (process.env.NODE_ENV !== 'production') {
    return hot(WrappedComponent, { errorReporter: Redbox });
  }
  return WrappedComponent;
};
