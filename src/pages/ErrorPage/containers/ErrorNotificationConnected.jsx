import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserId } from 'store/common/userInfo/selector';

import { ErrorNotification } from '../components';

const ErrorNotificationConnected = ({ storageKey, ...otherProps }) => (
  <ErrorNotification storageKey={storageKey} {...otherProps} />
);

const mapStateToProps = state => ({
  storageKey: getUserId(state),
});

ErrorNotificationConnected.propTypes = {
  storageKey: PropTypes.number,
};

export default connect(mapStateToProps)(ErrorNotificationConnected);
