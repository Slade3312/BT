import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import DownloadReportButton from 'pages/AudienceStatistic/components/DownloadReportButton';
import ReportCoreList from '../ReportCoreList';
import ReportCoreWrapper from '../ReportCoreWrapper';
import ReportCoreHead from '../ReportCoreHead';
import ReportCoreMetaInfo from '../ReportCoreMetaInfo';

const cx = classNames.bind({ ...commonStyles });

function ReportCoreShortLayout({ items, isLight, campaignId }) {
  const { Reports: { orderFocusData } } = useContext(StoresContext);
  const { formattedTitle } = orderFocusData(campaignId);
  return (
    <ReportCoreWrapper isLight={isLight}>
      <ReportCoreHead title={formattedTitle} className={cx('marb-m')} />
      <ReportCoreMetaInfo campaignId={campaignId} className={cx('marb-l')} />
      <ReportCoreList items={items} className={cx('marb-l')} />
      <DownloadReportButton />
    </ReportCoreWrapper>
  );
}

ReportCoreShortLayout.propTypes = {
  isLight: PropTypes.bool,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    descriptions: PropTypes.arrayOf(PropTypes.string),
  })),
};

export default observer(ReportCoreShortLayout);
