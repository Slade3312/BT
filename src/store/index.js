import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';

let store = null;

/**
 * Project wide typical redux store
 * has three arguments, neither of which are required
 */
export function configureStore(initialState, rootReducer, extraMiddleware) {
  const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  store = createStore(
    rootReducer,
    initialState || {},
    composeEnhancers(applyMiddleware(thunk, ...(extraMiddleware || []))),
  );
  return store;
}

export function getStore() {
  if (store === null) throw new Error('Attempting to retrieve store before initialization');
  return store;
}
