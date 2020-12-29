import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ChartRow from 'pages/AudienceStatistic/components/ChartRow';
import { StoresContext } from 'store/mobx';
import { ChartManager, ChartPresentationManager } from 'pages/AudienceStatistic/components/ChartManagers';
import { ChartCol } from '../../../ChartCol';
import { DEFAULT_SERIES_COLORS_SET } from '../../../ChartBricks/constants';

function ReportChartsView({ className, isPresentationMode, onRendered }) {
  const { Reports } = useContext(StoresContext);
  const { charts, getFrameControls } = Reports;
  return (
    <div className={className}>
      <ChartRow>
        {charts.map(({ type, data, color, title, id, total }) => (
          <Fragment key={id}>
            {!getFrameControls(id)?.isErased && (
              <ChartCol type={type} data={data} title={title}>
                {!isPresentationMode ? (
                  <ChartManager
                    id={id}
                    type={type}
                    data={data}
                    color={color?.length > 0 ? color : DEFAULT_SERIES_COLORS_SET}
                    title={title}
                    total={total}
                    onRendered={onRendered}
                    hasFrameControls
                  />
                ) : (
                  <ChartPresentationManager
                    id={id}
                    type={type}
                    data={data}
                    color={color?.length > 0 ? color : DEFAULT_SERIES_COLORS_SET}
                    title={title}
                    total={total}
                    onRendered={onRendered}
                  />
                )}
              </ChartCol>
            )}
          </Fragment>
        ))}
      </ChartRow>
    </div>
  );
}

ReportChartsView.propTypes = {
  className: PropTypes.string,
  isPresentationMode: PropTypes.bool,
  onRendered: PropTypes.func,
};

export default observer(ReportChartsView);
