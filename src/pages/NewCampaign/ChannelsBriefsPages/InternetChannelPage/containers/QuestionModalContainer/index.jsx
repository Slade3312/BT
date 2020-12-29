import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AskQuestionModal, InfoMessageModal } from 'components/modals';
import { getCurrentCampaignId } from 'store/NewCampaign/storage/selectors';
import {
  getQuestionModalTitle,
  getQuestionModalDescription,
  getQuestionModalDeclineButton,
  getQuestionModalConfirmButton,
  getQuestionFieldPlaceholder,
  getQuestionEmptyValidationText,

  getQuestionModalErrorImageSrc,
  getQuestionModalErrorTitle,
  getQuestionModalErrorDescription,
  getQuestionModalErrorButtonText,

  getQuestionModalSuccessImageSrc,
  getQuestionModalSuccessTitle,
  getQuestionModalSuccessDescription,
  getQuestionModalSuccessButtonText,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { briefQuestionRequest } from 'requests/campaigns';

const QuestionModalContainer = ({
  campaignId,
  title,
  description,
  buttonDeclineText,
  buttonConfirmText,
  questionFieldPlaceholder,
  emptyValidationText,

  errorImageSrc,
  errorTitle,
  errorDescription,
  errorButtonText,

  successImageSrc,
  successTitle,
  successDescription,
  successButtonText,

  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleQuestionSend = async (values) => {
    setIsLoading(true);
    try {
      await briefQuestionRequest({ data: values, campaignId });
      setIsSuccessModalOpen(true);
    } catch (catchedError) {
      setError(catchedError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!error && !isSuccessModalOpen && (
        <AskQuestionModal
          title={title}
          description={description}
          buttonDeclineText={buttonDeclineText}
          buttonConfirmText={buttonConfirmText}
          placeholder={questionFieldPlaceholder}
          emptyValidationText={emptyValidationText}
          onClose={onClose}
          onQuestionSend={handleQuestionSend}
          isLoading={isLoading}
        />
      )}

      {error && (
        <InfoMessageModal
          imageSrc={errorImageSrc}
          title={errorTitle}
          description={errorDescription}
          buttonText={errorButtonText}
          onClose={onClose}
        />
      )}

      {isSuccessModalOpen && (
        <InfoMessageModal
          imageSrc={successImageSrc}
          title={successTitle}
          description={successDescription}
          buttonText={successButtonText}
          onClose={onClose}
        />
      )}
    </>
  );
};

QuestionModalContainer.propTypes = {
  campaignId: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonDeclineText: PropTypes.string,
  buttonConfirmText: PropTypes.string,
  questionFieldPlaceholder: PropTypes.string,
  emptyValidationText: PropTypes.string,

  errorImageSrc: PropTypes.string,
  errorTitle: PropTypes.string,
  errorDescription: PropTypes.string,
  errorButtonText: PropTypes.string,

  successImageSrc: PropTypes.string,
  successTitle: PropTypes.string,
  successDescription: PropTypes.string,
  successButtonText: PropTypes.string,

  onClose: PropTypes.func,
};

const mapStateToProps = (state, { template }) => ({
  campaignId: getCurrentCampaignId(state),
  title: getQuestionModalTitle(template),
  description: getQuestionModalDescription(template),
  buttonDeclineText: getQuestionModalDeclineButton(template),
  buttonConfirmText: getQuestionModalConfirmButton(template),
  questionFieldPlaceholder: getQuestionFieldPlaceholder(template),
  emptyValidationText: getQuestionEmptyValidationText(template),

  errorImageSrc: getQuestionModalErrorImageSrc(template),
  errorTitle: getQuestionModalErrorTitle(template),
  errorDescription: getQuestionModalErrorDescription(template),
  errorButtonText: getQuestionModalErrorButtonText(template),

  successImageSrc: getQuestionModalSuccessImageSrc(template),
  successTitle: getQuestionModalSuccessTitle(template),
  successDescription: getQuestionModalSuccessDescription(template),
  successButtonText: getQuestionModalSuccessButtonText(template),
});

export default connect(mapStateToProps, {})(QuestionModalContainer);
