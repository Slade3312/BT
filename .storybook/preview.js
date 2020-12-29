import React from 'react';
import { Provider } from 'react-redux';
import { addDecorator } from '@storybook/react';
import { configureStore } from 'store/index';

import rootReducer from 'store/rootReducer';
import { StoryLayout } from '../src/components/storybook';

const store = configureStore(rootReducer(undefined, {}), rootReducer);

const withProvider = story => (
  <Provider store={store}>
    {story()}
  </Provider>
);
addDecorator(withProvider);
addDecorator(storyFn => <StoryLayout>{storyFn()}</StoryLayout>);
