import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withToggle } from 'enhancers';
import { resetRequestData } from 'store/requests/actions';
import { FEEDBACK_REQUEST_KEY } from 'requests/feedback/constants';
import { pushShowQuestionPopupGA } from 'widgets/ga/actions';
import checkForInn from 'store/mobx/requests/checkForInn';
import { Banner } from 'components/common';

import {
  getFeedbackBannerTitle,
  getFeedbackBannerDescription,
  getFeedbackBannerBackgroundImage,
  getFeedbackBannerButtonText,
  getFormattedPhone,
} from 'store/common/templates/common/selectors';

import { FeedbackPopup } from './components';

function FeedbackBanner({
  buttonText,
  backgroundImage,
  isOpen,
  onOpen,
  onClose,
  onClosePopup,
  onPushShowPopupGA,
  ...rest
}) {
  const handleClick = async () => {
    const isFilledInn = await checkForInn();
    if (!isFilledInn) return;
    if (onOpen) onOpen();
    onPushShowPopupGA();
  };
  return (
    <Fragment>
      <Banner
        {...rest}
        isWide={false}
        button={{ text: buttonText }}
        background={{ image: backgroundImage, type: 'feedback' }}
        onButtonClick={handleClick}
      />

      {isOpen && (
        <FeedbackPopup isOpen={isOpen} onOpen={onOpen} onClose={() => { onClose(); onClosePopup(); }} />
      )}
    </Fragment>
  );
}

FeedbackBanner.propTypes = {
  ...Banner.propTypes,
  buttonText: PropTypes.string,
  background: PropTypes.string,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onClosePopup: PropTypes.func,
  onPushShowPopupGA: PropTypes.func,
};

const mapStateToProps = state => ({
  title: getFeedbackBannerTitle(state),
  description: getFeedbackBannerDescription(state),
  buttonText: getFeedbackBannerButtonText(state),
  phone: getFormattedPhone(state),
  backgroundImage: getFeedbackBannerBackgroundImage(state),
});

const mapDispatchToProps = dispatch => ({
  onClosePopup: () => dispatch(resetRequestData(FEEDBACK_REQUEST_KEY)),
  onPushShowPopupGA: () => dispatch(pushShowQuestionPopupGA()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withToggle(FeedbackBanner));
