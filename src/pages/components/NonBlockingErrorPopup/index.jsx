import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGlobalErrorMessage } from 'store/common/errorInfo/selectors';
import { clearGlobalErrorData } from 'store/common/errorInfo/actions';
import { NotificationPopup } from 'pages/NewCampaign/components';

function NonBlockingErrorPopup({ description, onClose }) {
  return (
    <NotificationPopup
      isOpen
      emoji="pointingHandUp"
      title="Произошла ошибка"
      buttonText="Понятно"
      onButtonClick={onClose}
      {...{ description, onClose }}
    />
  );
}

NonBlockingErrorPopup.propTypes = {
  description: PropTypes.node,
  onClose: PropTypes.func,
};

const mapStateToProps = state => ({
  description: getGlobalErrorMessage(state),
});

const mapDispatchToProps = {
  onClose: clearGlobalErrorData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NonBlockingErrorPopup);
