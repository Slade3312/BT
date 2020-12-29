import React, { useState, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import classNames from 'classnames/bind';
import { RemoveCampaignModal } from 'components/modals';
import { StoresContext } from 'store/mobx';
import { DeleteButton, IconLink } from 'components/buttons';
import { AUDIENCE_STATISTIC_REPORT_URL } from 'pages/constants';
import { TileCol } from '../../components';
import LoadDraftButton from '../LoadDraftButton';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ButtonControlsCol = ({
  isOrderInCompleted,
  isCampaignInDraft,
  campaignId,
  orderId,
}) => {
  const [isConfirmRemoveModal, setIsConfirmRemoveModalOpened] = useState(false);

  const getFocusReportUrl = `${AUDIENCE_STATISTIC_REPORT_URL}${campaignId}/${orderId}`;
  const { Audience } = useContext(StoresContext);
  const handleCampaignOrderDelete = async () => {
    try {
      await Audience.removeCampaignById(campaignId);
    } finally {
      setIsConfirmRemoveModalOpened(false);
    }
  };
  return (
    <Fragment>
      <TileCol>
        {/* <div className={cx('databaseButtonWrapper')}>
          <a target="_blank" rel="noopener noreferrer" href={`${CAMPAIGN_API_URL}${campaignId}/download_ctn_csv`}>
            База номеров
          </a>
        </div> */}

        {(isOrderInCompleted || isCampaignInDraft) &&
        <div className={cx('draftOrReportButtonWrapper')}>
          {isOrderInCompleted && <IconLink onClick={() => navigate(getFocusReportUrl)}>отчёт</IconLink>}
          {isCampaignInDraft && <LoadDraftButton campaignId={campaignId} />}
        </div>}

        <div className={cx('deleteIconWrapper')}>
          {isCampaignInDraft && <DeleteButton onClick={() => setIsConfirmRemoveModalOpened(true)} />}
        </div>
      </TileCol>

      {/* TODO add portal here */}
      {isConfirmRemoveModal && (
        <RemoveCampaignModal
          title="Удалить отчёт?"
          description={`Отчёт перестанет быть доступен, ${'\n'} как только вы нажмёте «Удалить».`}
          onClose={() => setIsConfirmRemoveModalOpened(false)}
          buttonDecline={{
            text: 'Отменить',
          }}
          buttonConfirm={{
            text: 'Удалить',
            onClick: handleCampaignOrderDelete,
          }}
        />
      )}
    </Fragment>
  );
};

ButtonControlsCol.propTypes = {
  orderId: PropTypes.number,
  campaignId: PropTypes.number,
  isCampaignInDraft: PropTypes.bool,
  isOrderInCompleted: PropTypes.bool,
};

export default ButtonControlsCol;
