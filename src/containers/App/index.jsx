import React from 'react';
import { Provider } from 'react-redux';
import { withHMR } from 'utils/hmr-provider';
import { initializeStore } from 'store/store';
import { MobxStoreProvider } from 'store/mobx';
import 'mobx-react-lite/batchingForReactDom';
import 'react-dates/initialize';
import 'styles/datepicker.css';
import 'styles/suggester.css';
import 'styles/cropper.css';
import Routes from 'pages/routes';
import RoutesWithoutAuth from 'pages/RoutesWithoutAuth';
import LocationProvider from '../../utils/location/location-provider';
import AdaptivityProvider from '../AdaptivityProvider';
import {
  ErrorCatcher,
  AppUserAccessInitializator,
  AppGlobalSubscriber,
} from './components';
import BaseTemplatesInitializer from './components/BaseTemplatesInitializer';

const store = initializeStore();

export function App() {
  return (
    <Provider store={store}>
      <LocationProvider>
        <AdaptivityProvider>
          <MobxStoreProvider>
            <BaseTemplatesInitializer>
              <RoutesWithoutAuth>
                <AppGlobalSubscriber>
                  <ErrorCatcher>
                    <AppUserAccessInitializator>
                      <Routes />
                    </AppUserAccessInitializator>
                  </ErrorCatcher>
                </AppGlobalSubscriber>
              </RoutesWithoutAuth>
            </BaseTemplatesInitializer>
          </MobxStoreProvider>
        </AdaptivityProvider>
      </LocationProvider>
    </Provider>
  );
}

export default withHMR(App);
