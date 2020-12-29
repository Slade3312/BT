import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { InViewPortDetector } from 'components/helpers';
import FeedbackBanner from '../FeedbackBanner';
import { pushShowQuestionBlockGA } from '../ga/actions';

function FeedbackBannerGA({ onPushShowBlockGA, ...otherProps }) {
  return (
    <InViewPortDetector onIntersectIn={onPushShowBlockGA} detectInLimit={1} threshold={0.5}>
      <FeedbackBanner {...otherProps} />
    </InViewPortDetector>
  );
}

FeedbackBannerGA.propTypes = {
  onPushShowBlockGA: PropTypes.func,
};

export default connect(
  null,
  { onPushShowBlockGA: pushShowQuestionBlockGA },
)(FeedbackBannerGA);
