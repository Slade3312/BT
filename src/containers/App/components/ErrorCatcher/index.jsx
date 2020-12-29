import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import AuthorizationStore from 'store/mobx/Authorization';
import ErrorPage from 'pages/ErrorPage/index';
import { getHasBlockingError } from 'store/common/errorInfo/selectors';
import Authorization from 'pages/Authorization';
import { extractError } from 'utils/errors';
import { toastErrorNotification } from 'modules/toast-notifications';
import { passAsIs } from 'utils/fn';
import { isRunOnProductionBuild } from 'utils/env';

const handleUnhandledPromiseReject = (error) => {
  const getMessage = () => {
    const status = error.reason?.response?.status;
    const reasonUrl = error.reason?.request?.responseURL;

    const { title, description } = extractError(error.reason);

    let message = null;

    if (title || description) {
      message = [title, description].join('. ');
    } else {
      message = error.reason?.message || 'Неизвестная ошибка';
    }

    const messageData = [
      `${message} 😭.\nНепредвиденная ошибка, надо бы проверить`,
      status && `Status ${status}`,
      reasonUrl && reasonUrl,
    ].filter(passAsIs);

    return messageData.join('\n');
  };

  toastErrorNotification(getMessage());
};

@observer
class ErrorHandler extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props) {
    super(props);

    // Only for development, not for production
    if (!isRunOnProductionBuild()) {
      window.addEventListener('unhandledrejection', handleUnhandledPromiseReject);
    }
  }

  render() {
    const { hasBlockingError, children } = this.props;
    const { hasError } = this.state;
    if (!AuthorizationStore.isLoggedIn) return <Authorization />;

    return hasBlockingError || hasError ? (
      <ErrorPage />
    ) : (
      <>
        {/* <ToastNotifications /> */}
        {children}
      </>
    );
  }
}

ErrorHandler.propTypes = {
  hasBlockingError: PropTypes.any,
  children: PropTypes.node,
};

if (process.env.NODE_ENV !== 'production') {
  ErrorHandler.displayName = 'ErrorHandler';
}

const mapStateToProps = (state) => ({
  hasBlockingError: getHasBlockingError(state),
});

export default connect(mapStateToProps)(ErrorHandler);
