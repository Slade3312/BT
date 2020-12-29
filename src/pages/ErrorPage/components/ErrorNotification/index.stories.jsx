import React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { ErrorNotification } from 'pages/ErrorPage/components';
import { Description } from 'components/storybook';

import error404Model from 'pages/ErrorPage/data/404-error';
import error403Model from 'pages/ErrorPage/data/403-error';
import error423UserModel from 'pages/ErrorPage/data/423-user-error';
import error500Model from 'pages/ErrorPage/data/500-error';
import error500ReleaseModel from 'pages/ErrorPage/data/500-release-error';

export default {
  title: 'ErrorNotifications',
  decorators: [withKnobs],
};

const options = {
  403: 403,
  404: 404,
  423: 423,
  500: 500,
};

export const ErrorPage = () => {
  const errorStatus = select('errorStatus', options, 403);

  const getErrorModel = () => {
    let isSameRelease;

    switch (errorStatus) {
      case 403:
        return error403Model;
      case 404:
        return error404Model;
      case 423:
        return error423UserModel;
      default:
        if (!isSameRelease) return error500ReleaseModel;
        return error500Model;
    }
  };

  return (
    <React.Fragment>
      <Description>ErrorNotifications: </Description>

      <ErrorNotification
        {...getErrorModel()}
      />
    </React.Fragment>
  );
};
