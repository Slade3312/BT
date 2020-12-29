import React, { Fragment } from 'react';
import { Description } from 'components/storybook/index';

import Preloader from './index';

export default { title: 'Preloader' };

export const PreloaderComponent = () => (
  <Fragment>
    <Description>Прелоадер - индикатор загрузки</Description>

    <Preloader />
  </Fragment>
);
