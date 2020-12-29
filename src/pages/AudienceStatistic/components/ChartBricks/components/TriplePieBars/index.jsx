import React from 'react';
import PropTypes from 'prop-types';
import { labelFullInfoFormatter, labelPercentFormatter, tooltipFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';

const getLabelOptions = totalValue => ({
  normal: {
    color: CHART_ELEMENT_COLORS.LABEL_BASE,
    formatter: params => labelPercentFormatter(params.value, totalValue),
    show: true,
    position: 'right',
  },
});

const prepareYAxises = dataItems =>
  dataItems.map((dataItem, index) => ({
    data: dataItem.map(elem => elem.name),
    type: 'category',
    axisLabel: {
      interval: 0,
      rotate: 30,
      fontSize: 10,
    },
    splitLine: {
      show: false,
    },
    gridIndex: index,
  }));

/**
 *
 * @param data
 * require array with 5 colors, [color1 - pie, color2 - pie, color3 - pie, color4 - top bar, color5 - bottom bar]
 * @param color
 * @param otherProps
 */
function TriplePieBars({ data, color, existingOptions, className, onChangeOptions, onFinished, onRendered, total }) {
  // TODO when we well known BE format maybe we can remove under selectors
  // and processing all data in outer selectors
  const topBar = data[0];
  const bottomBar = data[1];
  const pie = data[2];

  const pieColors = color.slice(0, 3);

  const yAxisesData = prepareYAxises([topBar.data, bottomBar.data]);
  const dataBottomColors = color.slice(4, 5);
  const dataTopColors = color.slice(3, 4);
  const legendPieData = pie.data.map(elem => elem.name);

  const simpleBarTooltipFormatter = (params) => {
    switch (params.seriesName) {
      case topBar.name: {
        return tooltipFormatter(params.name, params.value, total);
      }
      case bottomBar.name: {
        return tooltipFormatter(params.name, params.value, total);
      }
      case pie.name:
        return tooltipFormatter(params.name, params.value, total);
      default:
        return '';
    }
  };

  const options = {
    ...existingOptions,
    tooltip: {
      trigger: 'item',
      formatter: simpleBarTooltipFormatter,
    },
    grid: [
      {
        top: 40,
        width: '40%',
        height: '40%',
        left: '50%',
        containLabel: true,
      },
      {
        top: '55%',
        width: '40%',
        height: '40%',
        left: '48%',
        containLabel: true,
      },
      {
        containLabel: true,
      },
    ],
    legend: [
      {
        data: legendPieData,
        width: '40%',
        top: '75%',
        left: '5%',
        orient: 'horizontal',
      },
    ],
    xAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
      {
        type: 'value',
        gridIndex: 1,
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: yAxisesData,
    series: [
      {
        type: 'bar',
        color: dataTopColors,
        stack: 'chart',
        name: topBar.name,
        z: 3,
        label: getLabelOptions(total),
        data: topBar.data,
      },
      {
        type: 'bar',
        color: dataBottomColors,
        stack: 'component',
        name: bottomBar.name,
        xAxisIndex: 1,
        yAxisIndex: 1,
        z: 3,
        label: getLabelOptions(total),
        data: bottomBar.data,
      },
      {
        type: 'pie',
        color: pieColors,
        avoidLabelOverlap: true,
        name: pie.name,
        label: {
          color: CHART_ELEMENT_COLORS.LABEL_BASE,
          lineHeight: 16,
          formatter: params => labelFullInfoFormatter(params.name, params.value, total),
        },
        radius: [0, 70],
        center: [180, '45%'],
        data: pie.data,
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

TriplePieBars.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default TriplePieBars;
