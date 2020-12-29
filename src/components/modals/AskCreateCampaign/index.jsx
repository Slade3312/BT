import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import { PopupStateless, OverlayLoader, Tooltip } from 'components/common';
import { ActionButton } from 'components/buttons';
import { TextAreaInput } from 'components/fields/TextInput';
import { composeAxiosPostRequest } from 'requests/helpers';
import { MANAGER_CAMPAIGN_CREATE } from 'requests/constants';
import { InfoMessageModal } from 'components/modals';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const AskCreateCampaign = ({ campaignId }) => {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFilledOut, setIsFilledOut] = useState(false);

  const { Templates, Common } = useContext(StoresContext);
  const template = Templates.getCommonTemplate('AskCreateCampaign');

  const handleQuestionChange = (data) => {
    setQuestion(data);
    if (!isFilledOut) {
      pushToGA({
        event: 'event_b2b_managerHelp',
        action: 'change_field',
        field: template.questionFieldPlaceholder,
        blockName: 'Обратитесь за помощью к менеджеру',
      });
    }
    setIsFilledOut(true);
  };

  const onClose = () => Common.set('isAskCreateCampaignVisible', false);

  const handleConfirmButtonClick = async () => {
    try {
      setLoading(true);
      const data = { description: question, campaign_id: campaignId };
      await composeAxiosPostRequest({
        url: MANAGER_CAMPAIGN_CREATE, data,
      });
      setSuccess(true);
      pushToGA({
        event: 'event_b2b_managerHelp',
        action: 'send_request_success',
        blockName: 'Обратиться за помощью к менеджеру',
      });
    } catch (e) {
      setError(true);
      pushToGA({
        event: 'event_b2b_managerHelp',
        action: 'send_request_error',
        blockName: 'Обратиться за помощью к менеджеру',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pushToGA({
      event: 'event_b2b_managerHelp',
      action: 'show_popup',
      blockName: 'Обратиться за помощью к менеджеру',
    });
  }, []);

  return (
    <PopupStateless opened onClose={onClose}>
      {
        !error && !success &&
        <div className={cx('content')}>
          <Heading level={2} className={cx('title', 'marb-m')}>{template.title}</Heading>

          <p className={cx('description')}>{template.description}</p>
          <OverlayLoader isLoading={loading}>
            <div className={styles.questionFieldWrapper}>
              <TextAreaInput
                value={question}
                placeholder={template.questionFieldPlaceholder}
                onChange={handleQuestionChange}
                className={cx('questionTextField')}
              />
              {template.tooltip && <Tooltip className={cx('tooltip')}>{template.tooltip}</Tooltip>}
            </div>

            <div className={cx('buttonsContainer')}>
              <ActionButton
                onClick={handleConfirmButtonClick}
                className={cx('button')}
                title="Custom event name"
              >
                {template.confirmButtonText}
              </ActionButton>
            </div>
          </OverlayLoader>
        </div>
      }

      {error && (
        <InfoMessageModal
          imageSrc={template.errorImageSrc}
          title={template.errorTitle}
          description={template.errorDescription}
          buttonText={template.errorButtonText}
          buttonClass={cx('button')}
          onClose={onClose}
        />
      )}

      {success && (
        <InfoMessageModal
          imageSrc={template.successImageSrc}
          title={template.successTitle}
          description={template.successDescription}
          buttonText={template.successButtonText}
          buttonClass={cx('button')}
          onClose={onClose}
        />
      )}
    </PopupStateless>
  );
};

AskCreateCampaign.propTypes = {
  campaignId: PropTypes.string,
};

export default observer(AskCreateCampaign);
