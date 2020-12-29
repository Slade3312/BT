import React from 'react';
import PropTypes from 'prop-types';
import { labelPercentFormatter, tooltipFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';

function SimpleBar({
  data,
  color,
  title,
  existingOptions,
  className,
  onChangeOptions,
  onFinished,
  onRendered,
  total,
}) {
  const dataNames = data.map(elem => elem.name);
  const options = {
    ...existingOptions,
    tooltip: {
      trigger: 'item',
      formatter: params => tooltipFormatter(params.name, params.value, total),
    },
    grid: {
      left: '15px',
      bottom: '20px',
      right: '70px',
      top: '50px',
      containLabel: true,
    },
    xAxis: {},
    yAxis: { type: 'category', data: dataNames },
    series: [
      {
        data: data.map((item, index) => ({ ...item, itemStyle: { color: color[index % color.length] } })),
        name: title,
        label: {
          normal: {
            color: CHART_ELEMENT_COLORS.LABEL_BASE,
            formatter: params => labelPercentFormatter(params.value, total),
            show: true,
            position: 'right',
          },
        },
        type: 'bar',
        color,
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

SimpleBar.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default SimpleBar;
