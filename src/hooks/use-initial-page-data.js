import { useState, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { composeErrorCatchingRequest } from '../requests/helpers';
import { useHotModuleEffect } from './use-hot-module-effect';

// to cache completed requests (global)
const completedRequestsMap = new Map();

const checkInitializationIsPassed = configToInitialize =>
  configToInitialize.length === 0 || configToInitialize.every(({ request }) => completedRequestsMap.get(request));

// pass to this hook array of request and actions to dispatch received to store or throw global error
// initializeRequestsConfig: [{ request, actionSetter }, { request, actionSetter }, ...]
// all requests will be global memoized for any point of the app
export const useInitialPageData = (initializeRequestsConfig) => {
  const passedRequests = useRef(0);

  const [isInitializePassed, setInitializePassed] = useState(checkInitializationIsPassed(initializeRequestsConfig));
  const dispatch = useDispatch();

  const handleInitialize = () => {
    initializeRequestsConfig.forEach(({ request, actionSetter }) => {
      const caughtRequest = composeErrorCatchingRequest(request);

      // make first init request or take already completed promise of the request
      const nextRequest = completedRequestsMap.get(request) || caughtRequest;

      nextRequest().then((response) => {
        completedRequestsMap.set(request, () => Promise.resolve(response));

        dispatch(actionSetter(response));

        passedRequests.current += 1;
        if (passedRequests.current === initializeRequestsConfig.length) {
          setInitializePassed(true);
        }
      });
    });
  };

  useMemo(() => {
    if (!isInitializePassed) {
      handleInitialize();
    }
  }, []);

  // to correct hmr store updating
  useHotModuleEffect(handleInitialize);

  return isInitializePassed;
};
