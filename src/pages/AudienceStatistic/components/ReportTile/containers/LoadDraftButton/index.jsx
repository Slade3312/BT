import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { PureButton } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function LoadDraftButton({ campaignId }) {
  const {
    CreateReport,
    Audience,
    Common,
  } = useContext(StoresContext);

  const handleRestoreFromDraft = async () => {
    if (Common.constants.FREE_FOCUS) {
      CreateReport.set('values', { campaignId });
      Audience.set('campaignsListLoading', true);

      await CreateReport.processOrderReport();

      CreateReport.set('isModalVisible', true);
    } else {
      CreateReport.restoreFromDraft(campaignId);
    }
  };

  return (
    <PureButton onClick={handleRestoreFromDraft} className={cx('component')}>
      {Common.constants.FREE_FOCUS ? 'Получить отчёт' : 'Оплатить'}
    </PureButton>
  );
}

LoadDraftButton.propTypes = {
  campaignId: PropTypes.number,
};

export default observer(LoadDraftButton);
