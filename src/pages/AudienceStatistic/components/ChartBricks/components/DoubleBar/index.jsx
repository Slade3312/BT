import React from 'react';
import PropTypes from 'prop-types';
import { labelPercentFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';

function DoubleBar({
  data,
  color,
  existingOptions,
  className,
  onChangeOptions,
  onFinished,
  onRendered,
  total,
}) {
  const xAxisData = data[0].data.map(elem => elem.name);
  const legendData = data.map(item => item.name);

  const options = {
    ...existingOptions,
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '15px',
      bottom: '35px',
      right: '30px',
      top: '120px',
      containLabel: true,
    },
    legend: {
      data: legendData,
      bottom: '0',
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: data.map((elem, index) => ({
      ...elem,
      color: color[index % color.length],
      type: 'bar',
      label: {
        normal: {
          color: CHART_ELEMENT_COLORS.LABEL_BASE,
          rotate: 90,
          distance: 3,
          align: 'left',
          fontSize: 10,
          verticalAlign: 'center',
          show: true,
          position: 'top',
          formatter: params => labelPercentFormatter(params.value, total),
        },
      },
    })),
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

DoubleBar.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default DoubleBar;
