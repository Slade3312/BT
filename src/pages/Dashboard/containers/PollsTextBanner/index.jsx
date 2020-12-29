import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { TextBanner } from 'pages/Dashboard/components';

const PollsTextBanner = () => {
  const { Templates: { getDashboardTemplate } } = useContext(StoresContext);

  const {
    title,
    description,
    button,
    textContent,
    backgroundColor,
    href,
  } = getDashboardTemplate('PollsTextBanner');

  return (
    <TextBanner
      title={title}
      description={description}
      buttonText={button}
      content={textContent}
      backgroundColor={backgroundColor}
      href={href}
      iconSlug="stickerHeart"
    />
  );
};

export default observer(PollsTextBanner);
