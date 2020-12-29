import React from 'react';
import PropTypes from 'prop-types';
import { RequestStatusList, REQUEST_SUCCESS, REQUEST_ERROR } from 'store/constants';
import FeedbackPopupPresentational from '../FeedbackPopupPresentational';

export default function withRequestStatusPopup(WrappedComponent) {
  function RequestStatusPopup({ successData, errorData, requestStatus, ...rest }) {
    if (requestStatus === REQUEST_SUCCESS) {
      return (
        <FeedbackPopupPresentational
          {...rest}
          title={successData.title}
          description={successData.description}
          buttonText={successData.buttonText}
        />
      );
    }
    if (requestStatus === REQUEST_ERROR) {
      return (
        <FeedbackPopupPresentational
          {...rest}
          title={errorData.title}
          description={errorData.description}
          buttonText={errorData.buttonText}
        />
      );
    }
    return <WrappedComponent {...rest} requestStatus={requestStatus} />;
  }

  RequestStatusPopup.propTypes = {
    ...WrappedComponent.propTypes,
    requestStatus: PropTypes.oneOf(RequestStatusList),
    successData: PropTypes.object,
    errorData: PropTypes.object,
  };

  RequestStatusPopup.defaultProps = {
    successData: {},
    errorData: {},
  };

  return RequestStatusPopup;
}
