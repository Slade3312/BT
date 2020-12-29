import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { IconPseudoLink } from 'components/buttons';
import { ReportScreenshotContext } from 'pages/AudienceStatistic/containers/ReportScreenshotMaker/context';

function DownloadReportButton({ className }) {
  const { onTakeScreenshot } = useContext(ReportScreenshotContext);

  const handleDownloadReport = () => {
    onTakeScreenshot();
  };

  return (
    <IconPseudoLink className={className} onClick={handleDownloadReport}>
      Скачать отчёт в PDF
    </IconPseudoLink>
  );
}

DownloadReportButton.propTypes = {
  className: PropTypes.string,
};

export default DownloadReportButton;
