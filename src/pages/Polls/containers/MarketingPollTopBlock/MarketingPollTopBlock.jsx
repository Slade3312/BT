import React, { useContext } from 'react';
import { StoresContext } from 'store/mobx';
import MainBannerLayout from 'pages/Polls/components/MainBannerLayout/MainBannerLayout';
import TariffsLayout from 'pages/Polls/components/TariffsLayout/TariffsLayout';
import PollsModal from 'pages/Polls/components/PollsModal/PollsModal';

const MarketingPollTopBlock = () => {
  const { Templates, Polls } = useContext(StoresContext);

  const { title, secondTitle, description, button, imgUrl } = Templates.getPollsTemplate('MainBanner');
  const { title: tariffsTitle } = Templates.getPollsTemplate('Tariffs');

  return (
    <>
      <MainBannerLayout
        title={title}
        secondTitle={secondTitle}
        description={description}
        button={button}
        imgUrl={imgUrl}
      />

      <TariffsLayout
        title={tariffsTitle}
        tariffs={Polls.tariffs}
      />

      <PollsModal />
    </>
  );
};

export default MarketingPollTopBlock;
