/**
 * Here we create redux reachRouter to work with reach/router
 */
import { createBrowserHistory } from 'history';
import { globalHistory } from '@reach/router';
import { createReduxHistoryContext } from 'redux-first-history';

/**
 * @reach/router globalHistory has slightly different API than normal history
 * Thus when used with redux-first-history, it ceases to work,
 * Adapter's goal is convert reachHistory interface to history compatible,
 * so it can be wrapped via reachify (createReduxHistory)
 */
const reachHistoryAdapter = (reachHistory) => {
  const originalHistory = createBrowserHistory(window);
  const adaptedHistory = Object.create(originalHistory);
  adaptedHistory.listen = (callback) => {
    reachHistory.listen(({ location }) => callback(location));
    return originalHistory.listen(callback);
  };
  return adaptedHistory;
};

const { routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: reachHistoryAdapter(globalHistory),
});

export { routerMiddleware, routerReducer };
