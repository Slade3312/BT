import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { LoadBaseBanner } from 'pages/AudienceStatistic/components';
import { StoresContext } from 'store/mobx';

const LoadBaseBannerText = () => {
  const {
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);
  const { title, description, backgroundImage, button } = getAudienceStatisticTemplate('LoadBaseBanner');
  return (
    <LoadBaseBanner
      title={title}
      description={description}
      backgroundImage={backgroundImage}
      buttonText={button}
    />
  );
};

export default observer(LoadBaseBannerText);
