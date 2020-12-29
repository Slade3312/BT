import React from 'react';
import PropTypes from 'prop-types';
import {
  CHART_DOUBLE_BAR,
  CHART_PIE,
  CHART_SIMPLE_BAR,
  CHART_TREE_MAP,
  CHART_PICTORIAL_BAR,
  CHART_TRIPLE_PIE_BARS,
} from 'store/AudienceStatistic/reportData/constants';
import { Chart, ChartNotSyncedOptions } from 'pages/AudienceStatistic/components/Chart';

function ChartPresentationSwitcher({ type, onRendered, data, color, title, id, total }) {
  const getChart = () => {
    switch (type) {
      case CHART_PIE:
        return (
          <Chart.Pie
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      case CHART_SIMPLE_BAR:
        return (
          <Chart.SimpleBar
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      case CHART_DOUBLE_BAR:
        return (
          <Chart.DoubleBar
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      case CHART_TREE_MAP:
        return (
          <ChartNotSyncedOptions.Tree
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      case CHART_PICTORIAL_BAR:
        return (
          <Chart.PictorialBar
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      case CHART_TRIPLE_PIE_BARS:
        return (
          <Chart.TriplePieBars
            id={id}
            onRendered={onRendered}
            data={data}
            color={color}
            title={title}
            total={total}
          />
        );
      default:
        return <div>Not found</div>;
    }
  };
  return getChart();
}

ChartPresentationSwitcher.propTypes = {
  type: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  color: PropTypes.arrayOf(PropTypes.string),
  legendData: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  notFoundName: PropTypes.string,
  onRendered: PropTypes.func,
  id: PropTypes.number,
};

export default ChartPresentationSwitcher;
