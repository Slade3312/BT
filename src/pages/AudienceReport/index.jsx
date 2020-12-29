import React, { useCallback, useEffect, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import {
  ReportFullLayout,
  FallbackReport,
  ReportScreenshotLayout,
} from 'pages/AudienceStatistic/components';
import { PageLoader } from 'components/common/Loaders';
import { ReportLoadProcessor, ReportScreenshotMaker, BannerInfoFull } from 'pages/AudienceStatistic/containers';
import PageLayout from 'pages/_PageLayout';
import { StoresContext } from 'store/mobx';
import { scrollSmoothTo } from '../../utils/scroll';

const cx = classNames.bind(commonStyles);

function AudienceReport({ orderId, campaignId }) {
  const { Reports, Templates } = useContext(StoresContext);
  const { getCampaignById, requestReportDataById } = Reports;
  const { getTemplate } = Templates;
  const [loading, setLoading] = useState(true);
  useEffect(() => scrollSmoothTo(0), []);
  useEffect(() => {
    Promise.all([
      getCampaignById(campaignId),
      requestReportDataById(orderId),
      getTemplate('audienceStatistic'),
    ]).finally(() => setLoading(false));
  }, []);
  const ScreenshotLayout = useCallback(
    ({ forwardedRef, ...otherProps }) => (
      <ReportScreenshotLayout {...otherProps} campaignId={campaignId} />
    ),
    [campaignId, loading],
  );

  return (
    <PageLayout isLeftMenuHide>
      <PageLoader isLoading={loading}>
        <ReportLoadProcessor Fallback={FallbackReport} orderId={orderId} campaignId={campaignId}>
          <ReportScreenshotMaker ScreenshotContainer={ScreenshotLayout}>
            <ReportFullLayout className={cx('marb-xl')} campaignId={campaignId} />
          </ReportScreenshotMaker>
        </ReportLoadProcessor>
        <BannerInfoFull className={cx('marb-l')} isHoverable />
      </PageLoader>
    </PageLayout>
  );
}

AudienceReport.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default observer(AudienceReport);
