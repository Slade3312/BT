import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

async function lazyEchartsModule() {
  return Promise.all([
    import(/* webpackChunkName: "echarts" */ 'echarts/index.simple'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/chart/treemap'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/chart/tree'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/component/markPoint'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/component/toolbox'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/component/tooltip'),
    import(/* webpackChunkName: "echarts" */ 'echarts/lib/component/legend'),

  ]).then(modules => modules[0]);
}

const MAGIC_TYPE_CHANGED = 'magictypechanged';
const DATA_VIEW_CHANGED = 'dataviewchanged';
const LEGEND_SELECTED = 'legendselected';
const LEGEND_UNSELECTED = 'legendunselected';
const LEGEND_SELECT_CHANGED = 'legendselectchanged';
const RESTORE = 'restore';

const watchChartEvents = [
  MAGIC_TYPE_CHANGED,
  DATA_VIEW_CHANGED,
  LEGEND_SELECTED,
  LEGEND_UNSELECTED,
  LEGEND_SELECT_CHANGED,
  RESTORE,
];

function Chart({ options, className, onChangeOptions, onFinished, onRendered, style }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  const handleChange = () => {
    onChangeOptions(chartInstance.getOption());
  };

  const handleFinished = () => {
    if (onFinished) {
      onFinished(chartInstance);
    }
  };

  const handleRendered = () => {
    if (onRendered) {
      onRendered(chartInstance);
    }
  };

  const onUnmount = () => {
    chartInstance.off('finished', handleFinished);
    chartInstance.off('rendered', handleRendered);
    watchChartEvents.forEach((eventName) => {
      chartInstance.off(eventName, handleChange);
    });
  };

  useEffect(() => {
    lazyEchartsModule().then((module) => {
      chartInstance = module.init(chartRef.current);
      chartInstance.on('finished', handleFinished);
      chartInstance.on('rendered', handleRendered);
      watchChartEvents.forEach((eventName) => {
        chartInstance.on(eventName, handleChange);
      });
      chartInstance.setOption(options);
    });
    return onUnmount;
  }, []);

  return <div style={style} className={className} ref={chartRef} />;
}

Chart.propTypes = {
  options: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default Chart;
