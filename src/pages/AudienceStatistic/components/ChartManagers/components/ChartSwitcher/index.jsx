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
import { Chart } from 'pages/AudienceStatistic/components/Chart';

function ChartSwitcher({ type, hasFrameControls, onRendered, data, color, title, id, total }) {
  const getChart = () => {
    switch (type) {
      case CHART_PIE:
        return (
          <Chart.Pie
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      case CHART_SIMPLE_BAR:
        return (
          <Chart.SimpleBar
            hasLineView
            hasBarView
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      case CHART_DOUBLE_BAR:
        return (
          <Chart.DoubleBar
            hasLineView
            hasBarView
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      case CHART_TREE_MAP:
        return (
          <Chart.TreeMap
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      case CHART_PICTORIAL_BAR:
        return (
          <Chart.PictorialBar
            hasLineView
            hasBarView
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      case CHART_TRIPLE_PIE_BARS:
        return (
          <Chart.TriplePieBars
            hasLineView
            hasBarView
            hasRestore
            hasSaveAsImage
            id={id}
            hasCollapse={hasFrameControls}
            hasErase={hasFrameControls}
            data={data}
            color={color}
            title={title}
            total={total}
            onRendered={onRendered}
          />
        );
      default:
        return <div>Not found</div>;
    }
  };
  return getChart();
}

ChartSwitcher.propTypes = {
  type: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  color: PropTypes.arrayOf(PropTypes.string),
  legendData: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  id: PropTypes.number,
  totalValue: PropTypes.number,
  isPresentationMode: PropTypes.bool,
  onRendered: PropTypes.func,
};

export default ChartSwitcher;
