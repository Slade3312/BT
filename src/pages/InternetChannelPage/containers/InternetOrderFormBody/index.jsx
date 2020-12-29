import React, { Fragment, useContext, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { useFormState } from 'react-final-form';
import { OverlayLoader } from 'components/common/Loaders/components';
import commonStyles from 'styles/common.pcss';
import { TARIFF_CARDS_NODE_ID } from 'constants/index';
import ReturnToChannelsButton from 'pages/NewCampaign/ChannelsBriefsPages/containers/ReturnButton';
import { Preloader } from 'components/common';
import NewLaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/InternetChannelPage/components/NewLaunchDates';
import TariffInfoLink from 'pages/NewCampaign/ChannelsBriefsPages/components/TariffInfoLink/index.jsx';
import { StepHeading, StepLayout } from 'pages/NewCampaign/components/index.js';
import { StoresContext } from 'store/mobx';
import { BudgetTotalField } from 'pages/NewCampaign/ChannelsBriefsPages/components/index.js';
import WebsiteField from '../../components/WebsiteField';
import IndustryField from '../../components/IndustryField';
import ToolsField from '../../components/ToolsField';
import Comment from '../../components/Comment';


import { ConfirmFormControls } from '../../components';
import TariffCardsInternet from '../TariffCardsInternet';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function InternetOrderFormBody() {
  const [isTariffsLoading, setTariffsLoading] = useState(false);
  const { Templates, Common, NewCampaign } = useContext(StoresContext);
  const { name } = Common.getChannelInfoByUid(NewCampaign.currentCampaign.channel_uid);
  const { mainTipsDescription } = Templates.getNewCampaignTemplate('BriefOrderInternet');

  const {
    values: { tariffs },
  } = useFormState();

  const hasTariffs = !!tariffs?.length;

  return (
    <Fragment>
      <StepLayout isStretched>

        <ReturnToChannelsButton />

        <StepHeading title={name} description={mainTipsDescription} className={cx('marb-s')} />

        <TariffInfoLink
          href="https://static.beeline.ru/upload/images/marketing/price_internet.pdf"
          afterLinkText="(PDF, 2 МБ)"
          iconSlug="pdf"
          className={cx('marb-l')}
        />

        <WebsiteField />

        <IndustryField />

        <NewLaunchDates className={cx('marb-s')} />

        <ToolsField />

        <BudgetTotalField />

        <Comment />

        <ConfirmFormControls isTariffsLoading={isTariffsLoading} setTariffsLoading={setTariffsLoading} />
      </StepLayout>

      <OverlayLoader isLoading={hasTariffs && isTariffsLoading}>
        <div id={TARIFF_CARDS_NODE_ID} className={cx({ indent: !hasTariffs })}>
          {hasTariffs && <TariffCardsInternet />}
        </div>
        {/* loader without background */}
        {!hasTariffs && isTariffsLoading && <Preloader />}
      </OverlayLoader>
    </Fragment>
  );
}

export default observer(InternetOrderFormBody);
