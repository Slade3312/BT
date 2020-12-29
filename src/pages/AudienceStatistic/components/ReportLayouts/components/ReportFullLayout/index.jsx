import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import ContentWrapper from '../ContentWrapper';
import ReportChartsView from '../../../ReportChartsContents/components/ReportChartsView';
import ReportCoreFullLayout from '../../../ReportCore/components/ReportCoreFullLayout';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function ReportFullLayout({ className, campaignId }) {
  const { Reports: { coreInfo } } = useContext(StoresContext);

  return (
    <div className={cx('component', className)}>
      <ReportCoreFullLayout items={coreInfo} campaignId={campaignId} />

      <ContentWrapper>
        <ReportChartsView />
      </ContentWrapper>
    </div>
  );
}

ReportFullLayout.propTypes = {
  className: PropTypes.string,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default observer(ReportFullLayout);
