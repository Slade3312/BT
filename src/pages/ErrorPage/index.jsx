import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { getGlobalErrorStatusCode, getGlobalErrorType } from 'store/common/errorInfo/selectors';
import { Wrapper } from 'components/layouts';
import { isScreenBelow800 } from 'store/common/breakpoint/selectors';
import { getIsSameRelease } from 'store/NewCampaign/controls/selectors';
import { OUTER_LINK_QUICKREQUEST } from 'pages/constants';
import {
  getTemplate403error,
  getTemplate404error,
  getTemplate423error,
  getTemplate500error,
  getTemplate500ReleaseError,
} from 'store/common/templates/errors/selectors';
import ErrorNotificationConnected from './containers/ErrorNotificationConnected';
import { Header } from './components';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

class ErrorPage extends Component {
  getErrorModel = () => {
    const {
      error403,
      error404,
      error423,
      error500,
      error500Release,
    } = this.props;
    switch (this.props.errorStatus) {
      case 403:
        return {
          model: error403,
          href: '/logout',
        };
      case 404:
        return {
          model: error404,
          href: '/',
        };
      case 423:
        return {
          model: error423,
          href: OUTER_LINK_QUICKREQUEST,
        };
      default:
        if (!this.props.isSameRelease) {
          return {
            model: error500Release,
            href: '/',
          };
        }
        return {
          model: error500,
          href: '/',
        };
    }
  };

  getbuttonTypeAndLink = () => {
    const { errorStatus, isSameRelease } = this.props;
    const btnParametrs = {
      404: {
        type: '',
        href: '/dashboard/',
      },
      403: {
        type: '',
        href: '/logout/',
      },
      500: {
        type: isSameRelease ? 'reset' : 'reload',
      },
    };
    return btnParametrs[errorStatus] || {};
  }

  render() {
    const { isMobile } = this.props;

    return (
      <div className={cx('wrapper')}>
        <Header isMobile={isMobile} logoHref={this.getErrorModel().href} />

        <Wrapper>
          <ErrorNotificationConnected
            {...this.getErrorModel().model}
            buttonActions={this.getbuttonTypeAndLink()}
            className={cx('notificationContainer', { mobile: isMobile })}
            isMobile={isMobile}
          />
        </Wrapper>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  isMobile: PropTypes.bool,
  isSameRelease: PropTypes.bool,
  errorStatus: PropTypes.number,
  error403: PropTypes.object,
  error404: PropTypes.object,
  error423: PropTypes.object,
  error500: PropTypes.object,
  error500Release: PropTypes.object,
};

const mapStateToProps = state => ({
  isMobile: isScreenBelow800(state),
  isSameRelease: getIsSameRelease(state),
  errorStatus: getGlobalErrorStatusCode(state),
  errorType: getGlobalErrorType(state),
  error404: getTemplate404error(state),
  error423: getTemplate423error(state),
  error403: getTemplate403error(state),
  error500: getTemplate500error(state),
  error500Release: getTemplate500ReleaseError(state),
});

export default connect(mapStateToProps)(ErrorPage);
