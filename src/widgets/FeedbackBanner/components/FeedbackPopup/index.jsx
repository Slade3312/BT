import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import commonStyles from 'styles/common.pcss';
import { RequestStatusList, REQUEST_INPROGRESS } from 'store/constants';
import { FEEDBACK_REQUEST_KEY } from 'requests/feedback/constants';
import { getRequestStatus } from 'store/requests/selectors';
import { getFeedbackPopupTemplate } from 'store/common/templates/popups/selectors';
import { getFeedbackErrorPopup, getFeedbackSuccessPopup } from 'store/common/templates/common/selectors';
import withRequestStatusPopup from '../withRequestStatusPopup';

import EmojiLoader from '../EmojiLoader';
import FeedbackForm from '../FeedbackForm';

import FeedbackPopupPresentational from '../FeedbackPopupPresentational';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function FeedbackPopup({ onClose, requestStatus, info: { title, description } }) {
  return (
    <FeedbackPopupPresentational title={title} description={description} onClose={onClose}>
      {requestStatus === REQUEST_INPROGRESS ? <EmojiLoader /> : <FeedbackForm className={cx('formContainer')} />}
    </FeedbackPopupPresentational>
  );
}

FeedbackPopup.propTypes = {
  onClose: PropTypes.func,
  requestStatus: PropTypes.oneOf(RequestStatusList),
  info: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  }),
};

const mapStateToProps = state => ({
  requestStatus: getRequestStatus(state)(FEEDBACK_REQUEST_KEY),
  successData: getFeedbackSuccessPopup(state),
  errorData: getFeedbackErrorPopup(state),
  info: getFeedbackPopupTemplate(state),
});

export default connect(mapStateToProps)(withRequestStatusPopup(FeedbackPopup));
