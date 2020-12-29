import React from 'react';
import PropTypes from 'prop-types';
import { isNullOrUndefined } from 'utils/fn';
import { labelFullInfoFormatter } from '../../utils/formatters';
import { CHART_ELEMENT_COLORS } from '../../constants';
import Chart from '../Chart';
import { deepCalculateCountOfLeaves } from './utils';

function Tree({ data, color, existingOptions, title, className, onChangeOptions, onFinished, onRendered }) {
  const treeData = { name: title, value: '', children: data };

  const chartHeight = deepCalculateCountOfLeaves(treeData.children) * 40;

  const options = {
    ...existingOptions,
    series: {
      name: title,
      type: 'tree',
      color,
      initialTreeDepth: -1,
      top: 10,
      left: 100,
      right: 200,
      bottom: 20,
      label: {
        normal: {
          color: CHART_ELEMENT_COLORS.LABEL_BASE,
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 9,
          formatter: (params) => {
            if (isNullOrUndefined(params.data.calculatedTotal)) return params.data.name; // for first node
            return labelFullInfoFormatter(params.name, params.value, params.data.calculatedTotal);
          },
        },
      },
      leaves: {
        label: {
          normal: {
            color: CHART_ELEMENT_COLORS.LABEL_BASE,
            position: 'right',
            verticalAlign: 'middle',
            width: 100,
            align: 'left',
          },
        },
      },
      data: [treeData],
    },
  };
  return (
    <Chart
      style={{ height: `${chartHeight}px` }}
      className={className}
      onChangeOptions={onChangeOptions}
      onFinished={onFinished}
      onRendered={onRendered}
      options={options}
    />
  );
}

Tree.propTypes = {
  data: PropTypes.array,
  color: PropTypes.arrayOf(PropTypes.string),
  existingOptions: PropTypes.object,
  className: PropTypes.string,
  onChangeOptions: PropTypes.func,
  onFinished: PropTypes.func,
  onRendered: PropTypes.func,
  title: PropTypes.string,
};

export default Tree;
