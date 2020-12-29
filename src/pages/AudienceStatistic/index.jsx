import React, { useEffect, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import PageLayout from 'pages/_PageLayout';
import commonStyles from 'styles/common.pcss';
import { CAMPAIGN_EXAMPLE_ID, ORDER_EXAMPLE_ID } from 'store/AudienceStatistic/reportData/constants';
import { OverlayLoader } from 'components/common';
import { StoresContext } from 'store/mobx';
import QuestionWidget from 'containers/QuestionWidget';
import { scrollSmoothTo } from 'utils/scroll';
import { PageLoader } from '../../components/common/Loaders/components';
import ChatWidget from '../../containers/ChatWidget';
import {
  CardsRow,
  EditCampaignStepper,
  FallbackReport,
  ReportShortLayout,
  ReportTilesList,
  TitlePart,
  ReportScreenshotLayout,
} from './components';

import {
  BannerInfoFull,
  CardInfoAdvising,
  CardInfoTariffs,
  HeadFocus,
  HeadReports,
  LoadBaseContainer,
  ReportLoadProcessor,
  ReportScreenshotMaker,
} from './containers';
import FocusCampaignForm from './components/EditCampaignStepper/components/FocusCampaignForm';
import { REPORTS_LIST_ID } from './constants';

const cx = classNames.bind(commonStyles);

const ScreenshotLayout = ({ ...otherProps }) => (
  <ReportScreenshotLayout {...otherProps} campaignId={CAMPAIGN_EXAMPLE_ID} />
);

function AudienceStatistic() {
  const {
    Audience: { totalCount, getCampaigns, isAnyOrderReady },
    Templates: { getTemplate },
    UserInfo: { getUser },
    CreateReport: { isModalVisible, loading },
    Common: { getConstants, getStatuses },
  } = useContext(StoresContext);
  const [initialLoaded, setInitialLoading] = useState(false);

  useEffect(() => scrollSmoothTo(0), []);
  useEffect(() => {
    const result = async () => {
      await Promise.all([
        getUser(),
        getConstants(),
        getTemplate('audienceStatistic'),
        getTemplate('popups'),
        getStatuses(),
        getCampaigns(),
      ]);
      setInitialLoading(true);
    };
    result();
  }, []);

  return (
    <PageLoader isLoading={!initialLoaded}>
      <PageLayout>
        <HeadFocus className={cx('marb-m', 'padh-m')} />

        <FocusCampaignForm className={cx('marb-s')}>
          <OverlayLoader isLoading={loading}>
            <LoadBaseContainer className={cx('marb-l')} />
          </OverlayLoader>
        </FocusCampaignForm>

        <CardsRow>
          <CardInfoAdvising />
          <CardInfoTariffs />
        </CardsRow>

        <div id={REPORTS_LIST_ID}>
          {!totalCount ? (
            <>
              <TitlePart className={cx('marb-s', 'padh-m', 'mart-xl')}>Мои отчёты</TitlePart>
              <ReportLoadProcessor Fallback={FallbackReport} campaignId={CAMPAIGN_EXAMPLE_ID} orderId={ORDER_EXAMPLE_ID}>
                <ReportScreenshotMaker ScreenshotContainer={ScreenshotLayout} campaignId={CAMPAIGN_EXAMPLE_ID}>
                  <ReportShortLayout campaignId={CAMPAIGN_EXAMPLE_ID} className={cx('marb-xl')} />
                </ReportScreenshotMaker>
              </ReportLoadProcessor>
            </>
        ) : (
          <>
            <HeadReports className={cx('marb-l', 'padh-m', 'mart-l')} />
            <ReportTilesList />
          </>
        )}
        </div>
        {
          !isAnyOrderReady &&
          <BannerInfoFull className={cx('marb-l')} isHoverable /> ||
          null
        }

        {isModalVisible && <EditCampaignStepper />}

        <ChatWidget />

        <QuestionWidget />
      </PageLayout>
    </PageLoader>
  );
}

export default observer(AudienceStatistic);
