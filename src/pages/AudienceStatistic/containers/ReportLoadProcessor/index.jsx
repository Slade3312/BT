import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';

const ReportLoadProcessor = ({
  Fallback,
  children,
}) => {
  const { Reports } = useContext(StoresContext);
  const { chartsDataLoading, onEraseFrameControls } = Reports;
  useEffect(() => {
    onEraseFrameControls();
  }, []);
  return chartsDataLoading ? <Fallback /> : children;
};

ReportLoadProcessor.propTypes = {
  Fallback: PropTypes.any,
  children: PropTypes.node,
};

export default observer(ReportLoadProcessor);
