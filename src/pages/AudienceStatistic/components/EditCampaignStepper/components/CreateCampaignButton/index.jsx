import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import { SingleFileUploadInput } from 'components/fields';
import { GlobalIcon } from 'components/common';
import styles from 'components/buttons/ActionButtons/styles.pcss';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import { FIELD_FILE } from '../../constants';

const cx = classNames.bind(styles);

function CreateCampaignButton({ children, isLight, className, iconSlug }) {
  const {
    CreateReport,
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);
  const { title } = getAudienceStatisticTemplate('LoadBaseBanner');

  const handleClick = () => {
    pushToGA({
      event: 'event_b2b_audienceAnalysis',
      action: 'click_Получить портрет аудитории',
      blockName: title,
    });
  };

  const handleFileUploadChange = async (fileBlob) => {
    await CreateReport.processLoadFileStep(fileBlob);

    if (!CreateReport.error.title) {
      await CreateReport.processPrepareOrderStep();
    }
  };

  return (
    <SingleFileUploadInput
      accept=".txt,.csv,.xlsx"
      onChange={handleFileUploadChange}
      onClick={handleClick}
      name={FIELD_FILE}
      className={className}
    >
      <span className={cx('component', { light: isLight })}>
        <span>{children}</span>
        <GlobalIcon slug={iconSlug} className={cx('icon')} />
      </span>
    </SingleFileUploadInput>
  );
}

CreateCampaignButton.propTypes = {
  children: PropTypes.node,
  isLight: PropTypes.bool,
  className: PropTypes.string,
  iconSlug: PropTypes.string,
};
export default observer(CreateCampaignButton);
