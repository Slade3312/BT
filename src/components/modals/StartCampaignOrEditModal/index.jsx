import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PopupStateless } from 'components/common/Popup/components/Popup';
import { ActionButton } from 'components/buttons/ActionButtons';
import commonStyles from 'styles/common.pcss';
import { Heading } from 'components/layouts';
import Templates from 'store/mobx/Templates';
import styles from './styles.pcss';

export const TEMPLATES = {
  FAIL: 'CampaignFailPopup',
  SUCCESS: 'CampaignSuccessPopup',
  UPDATED: 'CampaignUpdatedPopup',
};

const StartCampaignOrEditModal = ({
  giveAnswer,
  templateSource = TEMPLATES.SUCCESS,
}) => {
  return (
    <PopupStateless opened onClose={() => giveAnswer(true)}>
      <div className={styles.content}>
        <Heading level={1} className={commonStyles['marb-m']}>
          {Templates.getNewCampaignTemplate(`${templateSource}`).title }
        </Heading>

        <Heading
          level={3}
          className={classNames(styles.description, commonStyles['marb-xs'])}
          >
          {Templates.getNewCampaignTemplate(`${templateSource}`).description}
        </Heading>

        <div className={styles.buttonsContainer}>

          <ActionButton
            onClick={() => giveAnswer(true)}
            className={classNames(styles.button)}
            >
            {Templates.getNewCampaignTemplate(`${templateSource}`).buttonText}
          </ActionButton>
        </div>
      </div>
    </PopupStateless>
  );
};

StartCampaignOrEditModal.propTypes = {
  giveAnswer: PropTypes.func,
  templateSource: PropTypes.string,
};

export default StartCampaignOrEditModal;
