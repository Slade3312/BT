import React from 'react';
import PropTypes from 'prop-types';
import { labelFullInfoFormatter, tooltipFormatter } from '../../utils/formatters';
import Chart from '../Chart';

function TreeMap({ data, color, existingOptions, title, className, onChangeOptions, onFinished, onRendered }) {
  const options = {
    ...existingOptions,
    tooltip: {
      trigger: 'item',
      formatter: params => tooltipFormatter(params.data.name, params.data.value, params.data.calculatedTotal),
    },
    xAxis: { show: false },
    yAxis: { type: 'category', show: false },
    grid: {
      containLabel: true,
    },
    series: {
      name: title,
      type: 'treemap',
      roam: 'move',
      width: '90%',
      height: '90%',
      label: {
        show: true,
        color: '#eaeaea',
        fontSize: 14,
        lineHeight: 20,
        formatter: params => labelFullInfoFormatter(params.name, params.value, params.data.calculatedTotal),
      },
      breadcrumb: { emptyItemWidth: 50 },
      levels: [
        {
          color,
          itemStyle: {
            normal: {
              borderColor: '#221e1f',
              borderWidth: 2,
            },
          },
        },
        {
          color,
          itemStyle: {
            normal: {
              borderColor: '#221e1f',
              borderWidth: 1,
            },
          },
        },
        {
          color,
          itemStyle: {
            normal: {
              borderColor: '#221e1f',
              borderWidth: 2,
            },
          },
        },
        {
          color,
          itemStyle: {
            normal: {
              borderColor: '#221e1f',
              borderWidth: 2,
            },
          },
        },
        {
          color,
          itemStyle: {
            normal: {
              borderColor: '#221e1f',
              borderWidth: 2,
            },
          },
        },
      ],
      leafDepth: 1,
      data,
    },
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

TreeMap.propTypes = {
  data: PropTypes.array,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
  title: PropTypes.string,
};

export default TreeMap;
