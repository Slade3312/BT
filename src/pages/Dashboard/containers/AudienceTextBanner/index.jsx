import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { TextBanner } from 'pages/Dashboard/components';

const AudienceTextBanner = () => {
  const { Templates: { getDashboardTemplate } } = useContext(StoresContext);

  const {
    title,
    description,
    button,
    textContent,
    backgroundColor,
    href,
  } = getDashboardTemplate('AudienceTextBanner');

  return (
    <TextBanner
      title={title}
      description={description}
      buttonText={button}
      content={textContent}
      backgroundColor={backgroundColor}
      href={href}
      iconSlug="stickerCard"
    />
  );
};

export default observer(AudienceTextBanner);
