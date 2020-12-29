import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { CardInfo } from 'components/common';
import { scrollSmoothToNodeById } from 'utils/scroll';

const CardInfoTariffs = () => {
  const {
    Templates: { getAudienceStatisticTemplate },
  } = useContext(StoresContext);
  const {
    title,
    icon,
    button,
    buttonHref,
    description,
  } = getAudienceStatisticTemplate('TariffesCard');

  const handleButtonClick = () => {
    scrollSmoothToNodeById('load-base-banner');
  };

  return (
    <CardInfo
      title={title}
      iconSlag={icon}
      buttonHref={buttonHref}
      description={description}
      buttonText={button}
      onButtonClick={handleButtonClick}
    />
  );
};

export default observer(CardInfoTariffs);
