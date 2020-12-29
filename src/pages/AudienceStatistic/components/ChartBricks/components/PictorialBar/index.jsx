import React from 'react';
import PropTypes from 'prop-types';
import { mapChartIcon } from 'pages/AudienceStatistic/utils';
import { axisLabelFormatter, labelPercentFormatter, tooltipFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';

const prepareMarkPointsData = data =>
  data.map((item, index) => ({
    yAxis: item.value,
    xAxis: index,
    value: '',
    symbol: `image://${mapChartIcon(item.name)}`,
    symbolSize: 40,
    itemStyle: {
      opacity: 0.5,
    },
    symbolKeepAspect: true,
    symbolOffset: [0, -45],
  }));

function PictorialBar({
  data,
  color,
  existingOptions,
  title,
  className,
  onChangeOptions,
  onFinished,
  onRendered,
  total,
}) {
  const legendNames = data.map(elem => elem.name);
  const markPointsData = prepareMarkPointsData(data);
  const options = {
    ...existingOptions,
    tooltip: {
      trigger: 'item',
      formatter: params => tooltipFormatter(params.name, params.value, total),
    },
    grid: {
      top: '110px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        data: legendNames,
        axisLabel: {
          interval: 0,
          // TODO: find out about this moment
          formatter: axisLabelFormatter(legendNames.length > 5 ? 10 : 20),
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        data: data.map((item, index) => ({ ...item, itemStyle: { color: color[index % color.length] } })),
        name: title,
        type: 'bar',
        color,
        barWidth: '60%',
        label: {
          normal: {
            color: CHART_ELEMENT_COLORS.LABEL_BASE,
            formatter: params => labelPercentFormatter(params.value, total),
            show: true,
            position: 'top',
            offset: [0, 2],
          },
        },
        markPoint: {
          cursor: 'default',
          tooltip: {
            show: false,
          },
          data: markPointsData,
        },
      },
    ],
  };

  return (
    <Chart
      className={className}
      onChangeOptions={onChangeOptions}
      onFinished={onFinished}
      onRendered={onRendered}
      options={options}
    />
  );
}

PictorialBar.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  total: PropTypes.number,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default PictorialBar;
