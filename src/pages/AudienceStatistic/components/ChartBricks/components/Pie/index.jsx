import React from 'react';
import PropTypes from 'prop-types';
import { labelFullInfoFormatter, tooltipFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';

function Pie({
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
  const legendData = data.map(el => el.name);
  const options = {
    ...existingOptions,
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: params => tooltipFormatter(params.name, params.value, total),
    },
    legend: {
      data: legendData,
      top: 'bottom',
      left: 'center',
      orient: 'horizontal',
    },
    series: [
      {
        name: title,
        type: 'pie',
        color,
        radius: ['20%', '50%'],
        center: ['50%', '45%'],
        label: {
          color: CHART_ELEMENT_COLORS.LABEL_BASE,
          lineHeight: 16,
          formatter: params => labelFullInfoFormatter(params.name, params.value, total),
        },
        labelLine: {
          length: 20,
          length2: 10,
          show: true,
        },
        data,
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

Pie.propTypes = {
  total: PropTypes.number,
  data: PropTypes.array,
  title: PropTypes.string,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
};

export default Pie;
