import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { useFormState } from 'react-final-form';
import { OverlayLoader } from 'components/common/Loaders/components';
import commonStyles from 'styles/common.pcss';
import {
  getBriefMainTipsDescription,
  getBriefTitle,
  getCampaignBriefsMap,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { Preloader } from 'components/common';
import NewLaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/InternetChannelPage/components/NewLaunchDates';
import { StepHeading, StepLayout } from '../../../../components';
import WebsiteField from '../../components/WebsiteField';
import IndustryField from '../../components/IndustryField';
import ToolsField from '../../components/ToolsField';
import Comment from '../../components/Comment';
import { TARIFF_CARDS_NODE_ID } from '../../../../constants';
import { ConfirmFormControls } from '../../components';
import { BudgetTotalField } from '../../../components';
import TariffCardsInternet from '../TariffCardsInternet';
import TariffInfoLink from '../../../components/TariffInfoLink';
import ReturnToChannelsButton from '../../../containers/ReturnButton';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export default function InternetOrderFormBody() {
  const [isTariffsLoading, setTariffsLoading] = useState(false);

  const template = useSelector(getCampaignBriefsMap)[CHANNEL_STUB_INTERNET];
  const title = getBriefTitle(template);
  const mainTipsDescription = getBriefMainTipsDescription(template);

  const {
    values: { tariffs },
  } = useFormState();

  const hasTariffs = !!tariffs?.length;

  return (
    <Fragment>
      <ReturnToChannelsButton />

      <StepLayout isStretched>
        <StepHeading title={title} description={mainTipsDescription} className={cx('marb-s')} />

        <TariffInfoLink
          href="https://static.beeline.ru/upload/images/marketing/price_internet.pdf"
          afterLinkText="(PDF, 208 KБ)"
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
