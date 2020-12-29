import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withAllChartsRenderedCallback } from 'pages/AudienceStatistic/enhancers';
import { StoresContext } from 'store/mobx';
import ReportHeading from 'pages/AudienceStatistic/components/ReportHeader';
import ContentWrapper from '../ContentWrapper';
import ReportChartsView from '../../../ReportChartsContents/components/ReportChartsView';
import ReportCoreScreenshotLayout from '../../../ReportCore/components/ReportCoreScreenshotLayout';

function ReportScreenshotLayout({ onRendered, campaignId }) {
  const chartsContainer = useRef(null);
  const { Reports } = useContext(StoresContext);
  const { coreInfo, charts, setReportRef } = Reports;
  useEffect(() => {
    setReportRef(chartsContainer.current);
  }, []);
  return (
    <div ref={chartsContainer}>
      <ReportHeading />
      <ReportCoreScreenshotLayout items={coreInfo} campaignId={campaignId} />
      <ContentWrapper>
        <ReportChartsView isPresentationMode charts={charts} campaignId={campaignId} onRendered={onRendered} />
      </ContentWrapper>
    </div>
  );
}

ReportScreenshotLayout.propTypes = {
  onRendered: PropTypes.func,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default withAllChartsRenderedCallback(observer(ReportScreenshotLayout));

