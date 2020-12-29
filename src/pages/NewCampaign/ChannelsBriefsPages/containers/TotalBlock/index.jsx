import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStartCampaign } from 'pages/NewCampaign/hooks/use-start-campaign';
import TotalGeneralBlock from '../../components/TotalGeneralBlock';
import GeneralStartCampaignModal from '../GeneralStartCampaignModal';

function TotalBlock() {
  const [isShowStartModal, setIsModalOpened] = useState(false);

  const handleStartCampaign = useStartCampaign({
    onSetModalState: setIsModalOpened,
  });

  return (
    <>
      <TotalGeneralBlock
        onButtonClick={() => setIsModalOpened(true)}
      />
      {isShowStartModal && (
        <GeneralStartCampaignModal
          onStartCampaign={handleStartCampaign}
          setIsOpenedModal={setIsModalOpened}
        />
      )}
    </>
  );
}

export default observer(TotalBlock);
