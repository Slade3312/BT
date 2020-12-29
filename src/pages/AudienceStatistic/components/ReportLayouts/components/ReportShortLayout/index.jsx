import React, { useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { AUDIENCE_STATISTIC_REPORT_URL } from 'pages/constants';
import { ActionLink } from 'components/buttons';
import { CAMPAIGN_EXAMPLE_ID, ORDER_EXAMPLE_ID } from 'store/AudienceStatistic/reportData/constants';
import ContentWrapper from '../ContentWrapper';
import ReportChartsView from '../../../ReportChartsContents/components/ReportChartsView';
import { ReportCoreShortLayout } from '../../../ReportCore/components';
import styles from './styles.pcss';

function ReportShortLayout({ className, campaignId }) {
  const { Reports } = useContext(StoresContext);
  const { charts, coreInfo } = Reports;
  return (
    <div className={classNames(styles.component, className)}>
      <ReportCoreShortLayout items={coreInfo} campaignId={campaignId} isLight />
      <ContentWrapper>
        <ReportChartsView className={styles.report} charts={charts} campaignId={campaignId} />
      </ContentWrapper>
      <div className={styles.footer}>
        <ActionLink
          href={`${AUDIENCE_STATISTIC_REPORT_URL}${CAMPAIGN_EXAMPLE_ID}/${ORDER_EXAMPLE_ID}`}
          className={styles.button}
          iconSlug="arrowRightMinimal"
        >
          Посмотреть отчёт
        </ActionLink>
      </div>
    </div>
  );
}

ReportShortLayout.propTypes = {
  className: PropTypes.string,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default observer(ReportShortLayout);
