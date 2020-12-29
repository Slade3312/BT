import { configureStore, getStore } from './index';
import { routerMiddleware } from './reachRouter';
import rootReducer from './rootReducer';

export const initializeStore = () => {
  const initialState = rootReducer(undefined, {});
  try {
    return getStore();
  } catch (err) {
    return configureStore(initialState, rootReducer, [routerMiddleware]);
  }
};
