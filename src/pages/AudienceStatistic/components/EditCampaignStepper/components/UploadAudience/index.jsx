import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import UploadFiles from 'pages/NewCampaign/TaxonsGroupPage/containers/UploadFiles';

function CreateCampaignButton() {
  const {
    CreateReport,
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);
  const { title, formatText, dragFileText, buttonText, downloadTemplateLink } = getAudienceStatisticTemplate('LoadBaseBanner');

  const handleClick = () => {
    pushToGA({
      event: 'event_b2b_audienceAnalysis',
      action: 'click_Получить портрет аудитории',
      blockName: title,
    });
  };

  const handleFileUploadChange = async (filesList) => {
    if (filesList.length > 1) return;
    handleClick();
    await CreateReport.processLoadFileStep(filesList[0]);

    if (!CreateReport.error.title) {
      await CreateReport.processPrepareOrderStep();
    }
  };

  return (
    <UploadFiles
      name="uploadPhoneNumbers"
      onFilesAdded={handleFileUploadChange}
      uploadFilesText={dragFileText}
      darkFormatText
      uploadFilesButton={buttonText}
      formatLabel={formatText}
      templateLink={downloadTemplateLink}
    />
  );
}

export default observer(CreateCampaignButton);
