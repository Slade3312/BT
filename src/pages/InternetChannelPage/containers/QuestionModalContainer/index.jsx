import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import { AskQuestionModal, InfoMessageModal } from 'components/modals';
import { briefQuestionRequest } from 'requests/campaigns';
import { StoresContext } from 'store/mobx';

const QuestionModalContainer = ({ onClose }) => {
  const { NewCampaign, Templates } = useContext(StoresContext);
  const campaignId = NewCampaign.currentCampaign.id;
  const { title,
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
  } = Templates.getNewCampaignTemplate('BriefOrderInternet').QuestionModal;
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
  onClose: PropTypes.func,
};

export default observer(QuestionModalContainer);
